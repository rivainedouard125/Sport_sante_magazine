'use server';

import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/* ── ACTION 1: Update Homepage (Metadata in Database, Images in Blob) ────── */
export async function updateHomePage(formData) {
  const issueNumber = formData.get('issueNumber');
  const issueDate   = formData.get('issueDate');
  const headline    = formData.get('headline');
  const subheadline = formData.get('subheadline');
  const bodyText    = formData.get('bodyText');
  const coverFile   = formData.get('cover');
  const sommaireRaw = formData.get('sommaire');

  if (!issueNumber) {
    return { success: false, error: "Numéro de l'édition requis." };
  }

  try {
    let coverUrl = null;

    // 1. Upload new cover to Vercel Blob (Cloud)
    if (coverFile && coverFile.size > 0) {
      const { url } = await put(`media/covers/current/cover-${issueNumber}.jpg`, coverFile, {
        access: 'public',
        addRandomSuffix: false,
      });
      coverUrl = url;
    }

    // 2. Process Dossiers
    const dossiersRaw = formData.get('dossiersData');
    let dossiersData = [];
    if (dossiersRaw) {
      dossiersData = JSON.parse(dossiersRaw);
      
      // Fetch existing issue to preserve old images if new ones aren't uploaded
      const existingIssue = await prisma.issue.findUnique({ where: { issueNumber } });
      let existingDossiers = [];
      if (existingIssue && existingIssue.sommaireJson) {
        try {
          const parsed = JSON.parse(existingIssue.sommaireJson);
          if (parsed && parsed.dossiers) existingDossiers = parsed.dossiers;
        } catch (e) {}
      }

      for (let i = 0; i < 3; i++) {
        const file = formData.get(`dossier_img_${i}`);
        let imageUrl = existingDossiers[i]?.imageSrc || '';
        
        if (file && file.size > 0) {
          const { url } = await put(`media/dossiers/current/dos-${i}-${issueNumber}.jpg`, file, {
            access: 'public',
            addRandomSuffix: false,
          });
          imageUrl = url;
        }
        
        if (dossiersData[i]) {
          dossiersData[i].imageSrc = imageUrl;
        }
      }
    }

    // Combine Sommaire and Dossiers into one JSON object
    let finalSommaireJson = '[]';
    try {
      const parsedSommaire = JSON.parse(sommaireRaw || '[]');
      finalSommaireJson = JSON.stringify({
        items: parsedSommaire,
        dossiers: dossiersData
      });
    } catch (e) {
      console.error("Failed to parse sommaireRaw");
    }

    // 3. Persist metadata to Vercel Postgres (Database) via Prisma
    await prisma.issue.upsert({
      where: { issueNumber: issueNumber },
      update: {
        issueDate:   issueDate || '',
        headline:    headline || '',
        subheadline: subheadline || '',
        bodyText:    bodyText || '',
        coverSrc:    coverUrl || undefined, // Only update if we uploaded a new one
        sommaireJson: finalSommaireJson,
        isCurrent:    true,
      },
      create: {
        issueNumber: issueNumber,
        issueDate:   issueDate || '',
        headline:    headline || '',
        subheadline: subheadline || '',
        bodyText:    bodyText || '',
        coverSrc:    coverUrl || `/media/covers/current/cover-${issueNumber}.jpg`,
        sommaireJson: finalSommaireJson,
        isCurrent:    true,
      },
    });

    // Mark other issues as not current
    await prisma.issue.updateMany({
      where: { NOT: { issueNumber: issueNumber } },
      data: { isCurrent: false },
    });

    revalidatePath('/');
    return { success: true, message: `Page d'accueil mise à jour en Cloud (DB + Blob) — N°${issueNumber}` };
  } catch (err) {
    console.error('Update Error:', err);
    return { success: false, error: 'Mise à jour Cloud échouée : ' + err.message };
  }
}

/* ── ACTION 2: Upload Archive PDF (Vercel Blob) ─────────────────────────── */
export async function uploadArchive(formData) {
  const issueNumber = formData.get('issueNumber');
  const year        = formData.get('year') || new Date().getFullYear().toString();
  const pdfFile     = formData.get('pdf');

  if (!issueNumber || !pdfFile || pdfFile.size === 0) {
    return { success: false, error: 'Numéro et fichier PDF sont requis.' };
  }

  try {
    // 1. Upload PDF to Vercel Blob
    const { url } = await put(`media/archives/${year}/SportSante_${issueNumber}.pdf`, pdfFile, {
      access: 'public',
      addRandomSuffix: false,
    });

    // 2. Track it in our database for easier listing
    await prisma.archive.upsert({
      where: { issueNumber: issueNumber },
      update: { year, pdfUrl: url },
      create: { issueNumber, year, pdfUrl: url },
    });

    revalidatePath('/archives');
    revalidatePath('/');
    return { success: true, message: `N°${issueNumber} (${year}) archivé dans le Cloud.` };
  } catch (err) {
    console.error('Archive Error:', err);
    return { success: false, error: 'Upload Cloud échoué : ' + err.message };
  }
}

/* ── ACTION 3: Upload Photos (Vercel Blob) ───────────────────────────────── */
export async function uploadPhotos(formData) {
  const files   = formData.getAll('photos');
  const edition = formData.get('edition')?.trim();

  if (!files || files.length === 0 || files[0].size === 0) {
    return { success: false, error: 'Aucune photo sélectionnée.' };
  }

  try {
    let count = 0;
    for (const file of files) {
      if (file.size > 0) {
        const cleanBase = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_').toLowerCase();
        const prefix    = edition ? `n${edition}-` : '';
        const finalPath = `media/photos/${prefix}${cleanBase}`;

        await put(finalPath, file, {
          access: 'public',
          addRandomSuffix: false,
        });
        count++;
      }
    }
    revalidatePath('/photos');
    revalidatePath('/');
    return { success: true, message: `${count} photo(s) ajoutée(s) au Cloud Photothèque.` };
  } catch (err) {
    console.error('Photo Error:', err);
    return { success: false, error: 'Upload Cloud des photos échoué : ' + err.message };
  }
}
