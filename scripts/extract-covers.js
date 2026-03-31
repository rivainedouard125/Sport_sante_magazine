const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ARCHIVES_DIR = path.join(process.cwd(), 'public/media/archives');
const COVERS_DIR = path.join(process.cwd(), 'public/media/archive-covers');
const SWIFT_SCRIPT = path.join(process.cwd(), 'scripts/extract_cover.swift');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function extractCovers() {
  console.log('--- Starting PDF Cover Extraction ---');
  ensureDir(COVERS_DIR);

  const years = fs.readdirSync(ARCHIVES_DIR).filter(f => 
    fs.statSync(path.join(ARCHIVES_DIR, f)).isDirectory()
  );

  years.forEach(year => {
    const yearDir = path.join(ARCHIVES_DIR, year);
    const destYearDir = path.join(COVERS_DIR, year);
    ensureDir(destYearDir);

    const pdfs = fs.readdirSync(yearDir).filter(f => f.toLowerCase().endsWith('.pdf'));

    pdfs.forEach(pdf => {
        const pdfPath = path.join(yearDir, pdf);
        const coverName = pdf.replace(/\.pdf$/i, '.jpg');
        const coverPath = path.join(destYearDir, coverName);

        if (fs.existsSync(coverPath)) {
            console.log(`Skipping (already exists): ${coverName}`);
            return;
        }

        console.log(`Extracting cover for: ${pdf}...`);
        try {
            execSync(`swift "${SWIFT_SCRIPT}" "${pdfPath}" "${coverPath}"`);
            console.log(`Success: ${coverName}`);
        } catch (err) {
            console.error(`Error extracting cover for ${pdf}:`, err.message);
        }
    });
  });

  console.log('--- Extraction Complete ---');
}

extractCovers();
