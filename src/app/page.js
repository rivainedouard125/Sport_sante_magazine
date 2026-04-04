import prisma from '@/lib/prisma';
import HomeContent from './HomeContent';

async function getHomePageData() {
  try {
    const currentIssue = await prisma.issue.findFirst({
      where: { isCurrent: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (currentIssue) {
      return {
        ...currentIssue,
        sommaire: JSON.parse(currentIssue.sommaireJson || '[]'),
      };
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }

  // Fallback to static values if database is empty or down (useful for the first deploy!)
  return {
    issueNumber: '363',
    issueDate: 'Avril — Mai — Juin — 2024',
    headline: 'Dakar 2026 — Neels Theric a tutoyé les sommets',
    subheadline: 'Entre adrénaline et abnégation, le pilote aixois revient sur son expérience au rallye-raid le plus prestigieux du monde.',
    bodyText: 'Dans les dunes de l\'Arabie Saoudite, Neels Theric n\'a pas seulement piloté sa machine. Il a dompté ses propres limites physiques et mentales face à l\'adversité climatique et technique.',
    coverSrc: '/media/covers/current/cover-363.jpg',
    sommaire: [
      { id: 1, text: 'Dakar 2026 — Le retour triomphal de Neels Théric' },
      { id: 2, text: 'Dossier — Le Sport au service de la Santé Publique' },
      { id: 3, text: 'Portfolio — Les Moments Forts de l\'Édition Printemps' },
      { id: 4, text: 'Grand Angle — Le Tennis au Pays dAix' },
    ],
  };
}

export default async function Home() {
  const data = await getHomePageData();
  return <HomeContent data={data} />;
}
