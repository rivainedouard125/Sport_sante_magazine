import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

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
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'sport-sante/photos/',
      max_results: 500
    });

    const groups = {};

    result.resources.forEach(resource => {
      const filename = resource.public_id.split('/').pop();
      
      const match = filename.match(/^n(\d+)-/i);
      const edition = match ? match[1] : 'general';

      if (!groups[edition]) {
        groups[edition] = { edition, photos: [] };
      }

      groups[edition].photos.push({
        src: resource.secure_url,
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
