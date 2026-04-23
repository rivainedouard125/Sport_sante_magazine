import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import cloudinary from '@/lib/cloudinary';

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results = { archives: 0, issues: 0, errors: [] };

  try {
    // 1. Migrate Archives
    const archives = await prisma.archive.findMany();
    for (const arc of archives) {
      if (arc.pdfUrl.includes('cloudinary.com')) continue; // Already migrated
      
      try {
        const response = await fetch(arc.pdfUrl);
        if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
        const buffer = await response.arrayBuffer();
        
        const upload = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { 
              folder: `sport-sante/archives/${arc.year}`,
              public_id: `SportSante_${arc.issueNumber}`,
              resource_type: 'raw'
            },
            (err, res) => err ? reject(err) : resolve(res)
          ).end(Buffer.from(buffer));
        });

        await prisma.archive.update({
          where: { id: arc.id },
          data: { pdfUrl: upload.secure_url }
        });
        results.archives++;
      } catch (err) {
        results.errors.push(`Archive N°${arc.issueNumber}: ${err.message}`);
      }
    }

    // 2. Migrate Current Issue Cover
    const issues = await prisma.issue.findMany({ where: { NOT: { coverSrc: null } } });
    for (const issue of issues) {
      if (issue.coverSrc?.includes('cloudinary.com')) continue;

      try {
        const response = await fetch(issue.coverSrc);
        if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
        const buffer = await response.arrayBuffer();

        const upload = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { 
              folder: `sport-sante/covers`,
              public_id: `cover-${issue.issueNumber}`,
              overwrite: true
            },
            (err, res) => err ? reject(err) : resolve(res)
          ).end(Buffer.from(buffer));
        });

        await prisma.issue.update({
          where: { id: issue.id },
          data: { coverSrc: upload.secure_url }
        });
        results.issues++;
      } catch (err) {
        results.errors.push(`Cover N°${issue.issueNumber}: ${err.message}`);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
