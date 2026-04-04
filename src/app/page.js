import SidebarAds from '@/components/SidebarAds';
import PdfCoverThumb from '@/components/PdfCoverThumb';
import prisma from '@/lib/prisma';
import './home.css';

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
    issueNumber: '329',
    issueDate: 'Avril — Mai — Juin — 2024',
    headline: 'Dakar 2026 — Neels Theric a tutoyé les sommets',
    subheadline: 'Entre adrénaline et abnégation, le pilote aixois revient sur son expérience au rallye-raid le plus prestigieux du monde.',
    bodyText: 'Dans les dunes de l\'Arabie Saoudite, Neels Theric n\'a pas seulement piloté sa machine. Il a dompté ses propres limites physiques et mentales face à l\'adversité climatique et technique.',
    coverSrc: '/media/covers/current/cover-329.jpg',
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

  return (
    <main className="modern-home">
      
      {/* ── SECTION: MASTHEAD (Hero + Sidebar Ads) ────────────────── */}
      <section className="masthead-section">
        <div className="container masthead-grid">
          
          {/* THE HERO (70%) */}
          <div className="hero-editorial">
            <header className="hero-header">
              <span className="editorial-tag red">En Couverture • N°{data.issueNumber}</span>
              <span className="issue-date">{data.issueDate}</span>
            </header>

            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">{data.headline}</h1>
                <p className="hero-lead">{data.subheadline}</p>
                <p className="hero-body">{data.bodyText}</p>
              </div>
              
              <div className="hero-cover-wrapper">
                <img src={data.coverSrc} alt={`Magazine N°${data.issueNumber}`} className="main-cover" />
                <div className="cover-shadow"></div>
              </div>
            </div>

            <div className="hero-footer">
              <div className="sommaire-mini">
                <span className="sommaire-title">Au Sommaire :</span>
                <ul className="sommaire-list">
                  {data.sommaire.slice(0, 4).map((item, idx) => (
                    <li key={idx}>• {item.text}</li>
                  ))}
                </ul>
              </div>
              <div className="hero-actions">
                <a href="/abonnement" className="btn-editorial-red">S'abonner au Magazine</a>
                <a href="/archives" className="btn-text-link">Consulter les archives →</a>
              </div>
            </div>
          </div>

          {/* THE SIDEBAR (30%) */}
          <aside className="hero-sidebar">
            <SidebarAds />
          </aside>

        </div>
      </section>

      {/* ── SECTION: EXPLORATION DES ARCHIVES (Full Width) ─────────── */}
      <section className="archives-section">
        <div className="container">
          <header className="section-header-row">
            <div className="section-title-group">
              <span className="editorial-tag">Collection</span>
              <h2>Exploration des Archives</h2>
            </div>
            <a href="/archives" className="btn-text-link">Voir toute la collection →</a>
          </header>

          <div className="archives-grid-horizontal">
            {/* These would ideally be fetched from the DB too, but we'll use the PdfCoverThumb for now */}
            <div className="archive-mini-card">
              <PdfCoverThumb pdfUrl="/media/archives/2026/SportSante_364.pdf" className="mini-thumb" />
              <div className="archive-info">
                <span className="archive-num">N°364</span>
                <span className="archive-year">2026</span>
              </div>
            </div>
            <div className="archive-mini-card">
              <PdfCoverThumb pdfUrl="/media/archives/2025/SportSante_360.pdf" className="mini-thumb" />
              <div className="archive-info">
                <span className="archive-num">N°360</span>
                <span className="archive-year">2025</span>
              </div>
            </div>
            <div className="archive-mini-card">
              <PdfCoverThumb pdfUrl="/media/archives/2024/SportSante_329.pdf" className="mini-thumb" />
              <div className="archive-info">
                <span className="archive-num">N°329</span>
                <span className="archive-year">2024</span>
              </div>
            </div>
            <div className="archive-mini-card">
              <PdfCoverThumb pdfUrl="/media/archives/2023/SportSante_328.pdf" className="mini-thumb" />
              <div className="archive-info">
                <span className="archive-num">N°328</span>
                <span className="archive-year">2023</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ... Keeping the other sections ( Dossiers, Mot de la Rédaction, etc.) ... */}
      {/* (Rest of existing layout follows) */}
    </main>
  );
}
