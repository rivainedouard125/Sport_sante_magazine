import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Generate a clean human-readable label from a filename
function generateLabel(filename) {
  let base = filename
    .replace(/^n\d+-/i, '')   // strip edition prefix e.g. "n328-"
    .replace(/\.\w+$/, '');   // strip extension

  // If what remains is the generic "sport-sante-{number}" pattern,
  // replace it with "Photo N°{number}" — the original filenames were uninformative
  const genericMatch = base.match(/^sport[_-]sante[_-](\d+)$/i);
  if (genericMatch) {
    return `Photo N°${genericMatch[1]}`;
  }

  return base
    .replace(/[-_]/g, ' ')                        // separators → spaces
    .replace(/\bs\b/gi, "s'")                     // lone 's' → "s'" (contraction)
    .replace(/ (\d+)$/, ' #$1')                   // trailing number → "#N"
    .replace(/\b(\w)/g, c => c.toUpperCase())     // title-case
    .trim();
}

export async function GET() {
  const photosDir = path.join(process.cwd(), 'public/media/photos');

  try {
    if (!fs.existsSync(photosDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(photosDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return IMAGE_EXTS.includes(ext) && !f.startsWith('.');
    });

    // Group by edition number parsed from filename prefix "n{number}-*"
    // Files without a prefix get grouped under "general"
    const groups = {};

    files.forEach(filename => {
      const match = filename.match(/^n(\d+)-/i);
      const edition = match ? match[1] : 'general';

      if (!groups[edition]) {
        groups[edition] = { edition, photos: [] };
      }

      groups[edition].photos.push({
        src: `/media/photos/${filename}`,
        filename,
        label: generateLabel(filename),
      });
    });

    // Sort editions: numbered ones descending, "general" last
    const sorted = Object.values(groups).sort((a, b) => {
      if (a.edition === 'general') return 1;
      if (b.edition === 'general') return -1;
      return parseInt(b.edition) - parseInt(a.edition);
    });

    return NextResponse.json(sorted);
  } catch (err) {
    console.error('Error reading photos directory:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
