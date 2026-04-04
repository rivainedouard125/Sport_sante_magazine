import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const archivesDir = path.join(process.cwd(), 'public/media/archives');
  const coversDir = path.join(process.cwd(), 'public/media/covers/archives');

  try {
    if (!fs.existsSync(archivesDir)) {
      return NextResponse.json([]);
    }

    const years = fs.readdirSync(archivesDir).filter(f => 
      fs.statSync(path.join(archivesDir, f)).isDirectory()
    );

    const archives = [];

    years.forEach(year => {
      const yearDir = path.join(archivesDir, year);
      const pdfs = fs.readdirSync(yearDir).filter(f => f.toLowerCase().endsWith('.pdf'));

      pdfs.forEach(pdf => {
        const idMatch = pdf.match(/_(\d+)\.pdf$/i);
        const id = idMatch ? parseInt(idMatch[1], 10) : pdf;
        const title = `Sport Santé N°${id}`;
        
        // src points to the PDF — frontend renders page 1 via PDF.js, no static cover needed
        const src = `/media/archives/${year}/${pdf}`;
        const pdfUrl = `/media/archives/${year}/${pdf}`;

        archives.push({
          id,
          title,
          year,
          date: `Année ${year}`, // Placeholder date
          dossier: 'À découvrir dans ce numéro', // Placeholder dossier
          src,
          pdfUrl
        });
      });
    });

    // Sort by ID descending (newest first)
    archives.sort((a, b) => b.id - a.id);

    return NextResponse.json(archives);
  } catch (error) {
    console.error('Error fetching archives:', error);
    return NextResponse.json({ error: 'Failed to fetch archives' }, { status: 500 });
  }
}
