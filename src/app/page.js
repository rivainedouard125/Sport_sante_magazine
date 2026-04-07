import prisma from '@/lib/prisma';
import HomeContent from './HomeContent';

async function getHomePageData() {
  try {
    const [currentIssue, recentArchives] = await Promise.all([
      prisma.issue.findFirst({
        where: { isCurrent: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.archive.findMany({
        take: 4,
        orderBy: { issueNumber: 'desc' },
      })
    ]);

    if (currentIssue) {
      return {
        ...currentIssue,
        sommaire: JSON.parse(currentIssue.sommaireJson || '[]'),
        recentArchives: recentArchives,
      };
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }

  // Fallback to static values if database is empty or down (useful for the first deploy!)
  return {
    issueNumber: '363',
    issueDate: 'Mars — Avril — Mai — 2026',
    headline: 'Dakar 2026 — Neels Theric a tutoyé les sommets',
    subheadline: 'Entre adrénaline et abnégation, le pilote aixois revient sur son expérience au rallye-raid le plus prestigieux du monde.',
    bodyText: 'Dans les dunes de l\'Arabie Saoudite, Neels Theric n\'a pas seulement piloté sa machine. Il a dompté ses propres limites physiques et mentales face à l\'adversité climatique et technique.',
    coverSrc: '/media/covers/current/cover-363.jpg',
    sommaire: [
      { id: 1, page: '4',  text: 'Kilian et Alexis, fierté du PAN' },
      { id: 2, page: '5',  text: 'Le Méchant' },
      { id: 3, page: '6',  text: 'Neels Theric a tutoyé les sommets' },
      { id: 4, page: '7',  text: 'Georges Bagousse' },
      { id: 5, page: '8',  text: 'Magali Napolitani, quelle énergie !' },
      { id: 6, page: '9',  text: 'L’AVCAix Provence Dole à l’attaque' },
      { id: 7, page: '10', text: 'FC Tholonet : une certaine idée du foot' },
      { id: 8, page: '12', text: 'Les filles du SCAP passent un cap' },
      { id: 9, page: '13', text: 'Laziz Afarnos, la fibre associative' },
      { id: 10, page: '14', text: 'Échos de proximité' },
      { id: 11, page: '16', text: 'HumanFab : le rêve abouti de “JB”' },
      { id: 12, page: '17', text: 'L’AUC Padel joue l’ouverture' },
      { id: 13, page: '19', text: 'Luca Tamburro, la force tranquille' },
      { id: 14, page: '20', text: 'Le CHA très présent sur les compétitions' },
      { id: 15, page: '21', text: 'André Apostolo, aux mille passions' },
      { id: 16, page: '22', text: 'De perf en perf' },
      { id: 17, page: '24', text: 'Trophée France Sport : Uggo Barruol' },
    ],
  };
}

export default async function Home() {
  const data = await getHomePageData();
  return <HomeContent data={data} />;
}
