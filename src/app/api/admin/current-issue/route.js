import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
  // Ensure only authenticated admins can fetch this
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const currentIssue = await prisma.issue.findFirst({
      where: { isCurrent: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (!currentIssue) {
      return NextResponse.json({ error: "No current issue found" }, { status: 404 });
    }

    // Parse JSON data for frontend consumption
    let sommaire = [];
    let dossiers = [];
    try {
      const parsed = JSON.parse(currentIssue.sommaireJson || '[]');
      
      // Handle new format { items: [], dossiers: [] }
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        sommaire = parsed.items || [];
        dossiers = parsed.dossiers || [];
      } 
      // Handle old format [...] (just the sommaire array)
      else if (Array.isArray(parsed)) {
        sommaire = parsed;
      }
    } catch (e) {
      console.error("JSON parse error in API");
    }

    return NextResponse.json({
      ...currentIssue,
      sommaire,
      dossiers
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
