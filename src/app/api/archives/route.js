import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
  try {
    // 1. List all files from Vercel Blob that represent our archives
    const { blobs } = await list({
      prefix: 'media/archives/', // Fetch from our cloud folder
    });

    const archives = [];

    blobs.forEach(blob => {
      const filename = blob.pathname.split('/').pop();
      if (!filename.toLowerCase().endsWith('.pdf')) return;

      // Extract Year and Issue Number from the cloud path: media/archives/[YEAR]/SportSante_[NUMBER].pdf
      const pathParts = blob.pathname.split('/');
      const year = pathParts[2]; // media(0) / archives(1) / [YEAR](2)

      const idMatch = filename.match(/_(\d+)\.pdf$/i);
      const id = idMatch ? parseInt(idMatch[1], 10) : filename;
      const title = `Sport Santé N°${id}`;

      archives.push({
        id,
        title,
        year: year || 'N/A',
        date: `Année ${year}`,
        dossier: 'À découvrir dans ce numéro',
        src: blob.url,       // Points directly to the cloud URL
        pdfUrl: blob.url,
      });
    });

    // Sort by ID descending (newest first)
    archives.sort((a, b) => b.id - a.id);

    return NextResponse.json(archives);
  } catch (err) {
    console.error('Error fetching Cloud archives:', err);
    return NextResponse.json({ error: 'Failed to fetch cloud archives' }, { status: 500 });
  }
}
