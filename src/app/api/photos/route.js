import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

// Helper to generate a label from a cloud filename
function generateLabel(filename) {
  let base = filename
    .replace(/^n\d+-/i, '')
    .replace(/\.\w+$/, '');

  const genericMatch = base.match(/^sport[_-]sante[_-](\d+)$/i);
  if (genericMatch) return `Photo N°${genericMatch[1]}`;

  return base
    .replace(/[-_]/g, ' ')
    .replace(/\bs\b/gi, "s'")
    .replace(/ (\d+)$/, ' #$1')
    .replace(/\b(\w)/g, c => c.toUpperCase())
    .trim();
}

export async function GET() {
  try {
    // 1. List all photos stored in the Cloud
    const { blobs } = await list({
      prefix: 'media/photos/',
    });

    const groups = {};

    blobs.forEach(blob => {
      const filename = blob.pathname.split('/').pop();
      const ext = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);

      if (!IMAGE_EXTS.includes(`.${ext.toLowerCase()}`) || filename.startsWith('.')) return;

      const match = filename.match(/^n(\d+)-/i);
      const edition = match ? match[1] : 'general';

      if (!groups[edition]) {
        groups[edition] = { edition, photos: [] };
      }

      groups[edition].photos.push({
        src: blob.url,       // The high-speed Cloud URL
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
    console.error('Error reading Cloud photos:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
