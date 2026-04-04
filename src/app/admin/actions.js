'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

function getUploadDir(subPath) {
  const dir = path.join(process.cwd(), 'public/media', subPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// ── ACTION 1: Update Homepage (Cover + Title + Sommaire) ──────────────
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
    let coverSrc = null;

    // 1. Upload new cover if provided
    if (coverFile && coverFile.size > 0) {
      const buffer   = Buffer.from(await coverFile.arrayBuffer());
      const coverDir = path.join(process.cwd(), 'public/media/covers/current');
      if (!fs.existsSync(coverDir)) fs.mkdirSync(coverDir, { recursive: true });
      const ext      = coverFile.name.split('.').pop().toLowerCase();
      const fileName = `cover-${issueNumber}.${ext}`;
      fs.writeFileSync(path.join(coverDir, fileName), buffer);
      coverSrc = `/media/covers/current/${fileName}`;
    }

    // 2. Persist metadata to JSON for homepage to read
    const meta = {
      issueNumber,
      issueDate:   issueDate || '',
      headline:    headline || '',
      subheadline: subheadline || '',
      bodyText:    bodyText || '',
      coverSrc:    coverSrc || `/media/covers/current/cover-${issueNumber}.jpg`,
      sommaire:    sommaireRaw ? JSON.parse(sommaireRaw) : [],
      updatedAt:   new Date().toISOString(),
    };

    const metaPath = path.join(process.cwd(), 'public/media/covers/current/meta.json');
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

    revalidatePath('/');
    return { success: true, message: `Page d'accueil mise à jour — N°${issueNumber}` };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Mise à jour échouée : ' + err.message };
  }
}

// ── ACTION 2: Upload Archive PDF + Cover ─────────────────────────────
export async function uploadArchive(formData) {
  const issueNumber = formData.get('issueNumber');
  const year        = formData.get('year') || new Date().getFullYear().toString();
  const pdfFile     = formData.get('pdf');

  if (!issueNumber || !pdfFile || pdfFile.size === 0) {
    return { success: false, error: 'Numéro et fichier PDF sont requis.' };
  }

  try {
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const pdfDir    = getUploadDir(`archives/${year}`);
    fs.writeFileSync(path.join(pdfDir, `SportSante_${issueNumber}.pdf`), pdfBuffer);

    revalidatePath('/archives');
    revalidatePath('/');
    return { success: true, message: `N°${issueNumber} (${year}) archivé avec succès.` };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Upload échoué : ' + err.message };
  }
}

// ── ACTION 3: Upload Photos to Photothèque ────────────────────────────
export async function uploadPhotos(formData) {
  const files   = formData.getAll('photos');
  const edition = formData.get('edition')?.trim(); // optional: e.g. "363"

  if (!files || files.length === 0 || files[0].size === 0) {
    return { success: false, error: 'Aucune photo sélectionnée.' };
  }

  try {
    const photoDir = getUploadDir('photos');
    let count = 0;
    for (const file of files) {
      if (file.size > 0) {
        const buffer    = Buffer.from(await file.arrayBuffer());
        const cleanBase = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_').toLowerCase();
        // Prefix with edition number if provided, and not already prefixed
        const prefix    = edition ? `n${edition}-` : '';
        const alreadyPrefixed = cleanBase.match(/^n\d+-/);
        const finalName = (edition && !alreadyPrefixed) ? prefix + cleanBase : cleanBase;
        fs.writeFileSync(path.join(photoDir, finalName), buffer);
        count++;
      }
    }
    revalidatePath('/photos');
    revalidatePath('/');
    return { success: true, message: `${count} photo(s) ajoutée(s) à la photothèque.` };
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Upload des photos échoué : ' + err.message };
  }
}
