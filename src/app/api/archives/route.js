import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'sport-sante/archives/',
      max_results: 500,
      resource_type: 'raw' // PDFs are 'raw' in Cloudinary
    });

    const archives = [];

    result.resources.forEach(resource => {
      const filename = resource.public_id.split('/').pop();
      if (!resource.public_id.toLowerCase().endsWith('.pdf')) return;

      const pathParts = resource.public_id.split('/');
      const year = pathParts[2]; // sport-sante(0) / archives(1) / [YEAR](2)

      const idMatch = filename.match(/_(\d+)$/i); // Cloudinary public_id removes the extension usually
      const id = idMatch ? parseInt(idMatch[1], 10) : filename;
      const title = `Sport Santé N°${id}`;

      archives.push({
        id,
        title,
        year: year || 'N/A',
        date: `Année ${year}`,
        dossier: 'À découvrir dans ce numéro',
        src: resource.secure_url,
        pdfUrl: resource.secure_url,
      });
    });

    // Sort by ID descending (newest first)
    archives.sort((a, b) => (typeof b.id === 'number' && typeof a.id === 'number') ? b.id - a.id : 0);

    return NextResponse.json(archives);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
