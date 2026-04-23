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

    const FALLBACK_SOMMAIRE = [
      { id: 1, page: '4',  text: 'Kilian et Alexis, fierté du PAN' },
      { id: 2, page: '5',  text: 'Le Méchant' },
      { id: 3, page: '6',  text: 'Neels Theric a tutoyé les sommets' },
      { id: 4, page: '7',  text: 'Georges Bagousse' },
      { id: 5, page: '8',  text: 'Magali Napolitani, quelle énergie !' },
      { id: 6, page: '9',  text: 'L'AVCAix Provence Dole à l'attaque' },
      { id: 7, page: '10', text: 'FC Tholonet : une certaine idée du foot' },
      { id: 8, page: '12', text: 'Les filles du SCAP passent un cap' },
      { id: 9, page: '13', text: 'Laziz Afarnos, la fibre associative' },
      { id: 10, page: '14', text: 'Échos de proximité' },
      { id: 11, page: '16', text: 'HumanFab : le rêve abouti de "JB"' },
      { id: 12, page: '17', text: 'L'AUC Padel joue l'ouverture' },
      { id: 13, page: '19', text: 'Luca Tamburro, la force tranquille' },
      { id: 14, page: '20', text: 'Le CHA très présent sur les compétitions' },
      { id: 15, page: '21', text: 'André Apostolo, aux mille passions' },
      { id: 16, page: '22', text: 'De perf en perf' },
      { id: 17, page: '24', text: 'Trophée France Sport : Uggo Barruol' },
    ];

    const FALLBACK_DOSSIERS = [
      { tag: 'Grand Angle', title: 'Le Sport au service de la Santé Publique : Enjeux et Défis', imageSrc: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80' },
      { tag: 'Reportage', title: 'Aix s\'élance : Le guide complet des événements sportifs 2024', imageSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
      { tag: 'Elite', title: 'Grand Prix Cycliste : Dans les coulisses de la préparation', imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
    ];

    if (currentIssue) {
      let sommaireItems = [];
      let dossiers = null;
      try {
        const parsed = JSON.parse(currentIssue.sommaireJson || '[]');
        if (parsed && !Array.isArray(parsed) && parsed.items) {
          sommaireItems = parsed.items;
          dossiers = parsed.dossiers;
        } else {
          sommaireItems = parsed;
        }
      } catch (e) {}

      // If sommaire from DB is empty, use fallback
      if (!sommaireItems || sommaireItems.length === 0) {
        sommaireItems = FALLBACK_SOMMAIRE;
      }

      // If dossiers not yet saved via admin, use fallback
      if (!dossiers || dossiers.length === 0) {
        dossiers = FALLBACK_DOSSIERS;
      }

      return {
        ...currentIssue,
        sommaire: sommaireItems,
        dossiers: dossiers,
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
    dossiers: [
      { tag: 'Grand Angle', title: 'Le Sport au service de la Santé Publique : Enjeux et Défis', imageSrc: '/media/photos/n329-salon-des-sports-31.jpg' },
      { tag: 'Reportage', title: 'Aix s\'élance : Le guide complet des événements sportifs 2024', imageSrc: '/media/photos/n329-aix-s-elance1.jpg' },
      { tag: 'Elite', title: 'Grand Prix Cycliste : Dans les coulisses de la préparation', imageSrc: '/media/photos/n328-sport-sante-16.jpg' }
    ],
    recentArchives: [
      { issueNumber: '362', pdfUrl: '/media/archives/pdf/sport-sante-362.pdf' },
      { issueNumber: '361', pdfUrl: '/media/archives/pdf/sport-sante-361.pdf' },
      { issueNumber: '360', pdfUrl: '/media/archives/pdf/sport-sante-360.pdf' },
      { issueNumber: '359', pdfUrl: '/media/archives/pdf/sport-sante-359.pdf' },
    ]
  };
}

export default async function Home() {
  const data = await getHomePageData();
  return <HomeContent data={data} />;
}
