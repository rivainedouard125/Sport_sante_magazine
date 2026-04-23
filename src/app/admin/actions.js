'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import cloudinary from '@/lib/cloudinary';

/* ── HELPER: Upload to Cloudinary ── */
async function uploadToCloudinary(file, folder, publicId) {
  if (!file || file.size === 0) return null;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { 
        folder: `sport-sante/${folder}`,
        public_id: publicId,
        overwrite: true,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
}

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

/* ── ACTION 1E: Save Cover ── */
export async function saveIssueCover(formData) {
  const issueNumber = formData.get('issueNumber');
  const coverFile = formData.get('cover');
  if (!issueNumber || !coverFile || coverFile.size === 0) return { success: false, error: "Image requise." };

  try {
    const url = await uploadToCloudinary(coverFile, 'covers', `cover-${issueNumber}`);
    await prisma.issue.update({
      where: { issueNumber },
      data: { coverSrc: url }
    });
    revalidatePath('/');
    return { success: true, message: "Couverture mise à jour." };
  } catch (e) { return { success: false, error: e.message }; }
}

/* ── ACTION 2: Upload Archive PDF (Cloudinary) ─────────────────────────── */
export async function uploadArchive(formData) {
  const issueNumber = formData.get('issueNumber');
  const year        = formData.get('year') || new Date().getFullYear().toString();
  const pdfFile     = formData.get('pdf');

  if (!issueNumber || !pdfFile || pdfFile.size === 0) {
    return { success: false, error: 'Numéro et fichier PDF sont requis.' };
  }

  try {
    const url = await uploadToCloudinary(pdfFile, `archives/${year}`, `SportSante_${issueNumber}`);

    await prisma.archive.upsert({
      where: { issueNumber: issueNumber },
      update: { year, pdfUrl: url },
      create: { issueNumber, year, pdfUrl: url },
    });

    revalidatePath('/archives');
    revalidatePath('/');
    return { success: true, message: `N°${issueNumber} (${year}) archivé sur Cloudinary.` };
  } catch (err) {
    return { success: false, error: 'Upload Cloudinary échoué : ' + err.message };
  }
}

/* ── ACTION 3: Upload Photos (Cloudinary) ───────────────────────────────── */
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
        const cleanBase = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_').toLowerCase().split('.')[0];
        const prefix    = edition ? `n${edition}-` : '';
        const publicId  = `${prefix}${cleanBase}`;

        await uploadToCloudinary(file, 'photos', publicId);
        count++;
      }
    }
    revalidatePath('/photos');
    revalidatePath('/');
    return { success: true, message: `${count} photo(s) ajoutée(s) à Cloudinary.` };
  } catch (err) {
    return { success: false, error: 'Upload Cloudinary échoué : ' + err.message };
  }
}
