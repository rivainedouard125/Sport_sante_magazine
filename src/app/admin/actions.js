'use server';

import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/* ── HELPER: Get current issue state to preserve data ── */
async function getCurrentIssueState(issueNumber) {
  const issue = await prisma.issue.findUnique({ where: { issueNumber } });
  if (!issue) return { sommaire: [], dossiers: [] };
  try {
    const parsed = JSON.parse(issue.sommaireJson || '{}');
    return {
      sommaire: parsed.items || [],
      dossiers: parsed.dossiers || []
    };
  } catch (e) {
    return { sommaire: [], dossiers: [] };
  }
}

/* ── ACTION 1A: Save Issue Identity (Number & Date) ── */
export async function saveIssueIdentity(formData) {
  const issueNumber = formData.get('issueNumber');
  const issueDate = formData.get('issueDate');
  if (!issueNumber) return { success: false, error: "Numéro requis." };

  try {
    await prisma.issue.upsert({
      where: { issueNumber },
      update: { issueDate, isCurrent: true },
      create: { issueNumber, issueDate, isCurrent: true, sommaireJson: '{}', coverSrc: '' }
    });
    // Ensure this is the only current issue
    await prisma.issue.updateMany({ where: { NOT: { issueNumber } }, data: { isCurrent: false } });
    revalidatePath('/');
    return { success: true, message: "Identité mise à jour." };
  } catch (e) { return { success: false, error: e.message }; }
}

/* ── ACTION 1B: Save Editorial Content ── */
export async function saveIssueEditorial(formData) {
  const issueNumber = formData.get('issueNumber');
  const headline = formData.get('headline');
  const subheadline = formData.get('subheadline');
  const bodyText = formData.get('bodyText');
  if (!issueNumber) return { success: false, error: "Numéro requis." };

  try {
    await prisma.issue.update({
      where: { issueNumber },
      data: { headline, subheadline, bodyText }
    });
    revalidatePath('/');
    return { success: true, message: "Éditorial mis à jour." };
  } catch (e) { return { success: false, error: e.message }; }
}

/* ── ACTION 1C: Save Sommaire ── */
export async function saveIssueSommaire(formData) {
  const issueNumber = formData.get('issueNumber');
  const sommaireRaw = formData.get('sommaire');
  if (!issueNumber) return { success: false, error: "Numéro requis." };

  try {
    const { dossiers } = await getCurrentIssueState(issueNumber);
    const items = JSON.parse(sommaireRaw || '[]');
    await prisma.issue.update({
      where: { issueNumber },
      data: { sommaireJson: JSON.stringify({ items, dossiers }) }
    });
    revalidatePath('/');
    return { success: true, message: "Sommaire mis à jour." };
  } catch (e) { return { success: false, error: e.message }; }
}

/* ── ACTION 1D: Save Dossiers ── */
export async function saveIssueDossiers(formData) {
  const issueNumber = formData.get('issueNumber');
  const dossiersRaw = formData.get('dossiersData');
  if (!issueNumber) return { success: false, error: "Numéro requis." };

  try {
    const { sommaire, dossiers: existingDossiers } = await getCurrentIssueState(issueNumber);
    const dossiersData = JSON.parse(dossiersRaw || '[]');
    
    for (let i = 0; i < 3; i++) {
      const file = formData.get(`dossier_img_${i}`);
      let imageUrl = existingDossiers[i]?.imageSrc || '';
      
      if (file && file.size > 0) {
        // Keeping Blob for now until the migration step
        const { url } = await put(`media/dossiers/current/dos-${i}-${issueNumber}.jpg`, file, {
          access: 'public',
          addRandomSuffix: false,
        });
        imageUrl = url;
      }
      if (dossiersData[i]) dossiersData[i].imageSrc = imageUrl;
    }

    await prisma.issue.update({
      where: { issueNumber },
      data: { sommaireJson: JSON.stringify({ items: sommaire, dossiers: dossiersData }) }
    });
    revalidatePath('/');
    return { success: true, message: "Dossiers mis à jour." };
  } catch (e) { return { success: false, error: e.message }; }
}

/* ── ACTION 1E: Save Cover ── */
export async function saveIssueCover(formData) {
  const issueNumber = formData.get('issueNumber');
  const coverFile = formData.get('cover');
  if (!issueNumber || !coverFile || coverFile.size === 0) return { success: false, error: "Image requise." };

  try {
    const { url } = await put(`media/covers/current/cover-${issueNumber}.jpg`, coverFile, {
      access: 'public',
      addRandomSuffix: false,
    });
    await prisma.issue.update({
      where: { issueNumber },
      data: { coverSrc: url }
    });
    revalidatePath('/');
    return { success: true, message: "Couverture mise à jour." };
  } catch (e) { return { success: false, error: e.message }; }
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
