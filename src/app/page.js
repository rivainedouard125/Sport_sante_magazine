'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './home.css';

const sommaire = [
  ['4',  'Kilian et Alexis, fierté du PAN'],
  ['5',  'Le Méchant'],
  ['6',  'Neels Theric a tutoyé les sommets'],
  ['7',  'Georges Bagousse'],
  ['8',  'Magali Napolitani, quelle énergie !'],
  ['9',  "L'AVCAix Provence Dole à l'attaque"],
  ['10', 'FC Tholonet : une certaine idée du foot'],
  ['12', 'Les filles du SCAP passent un cap'],
  ['13', 'Laziz Afarnos, la fibre associative'],
  ['16', 'HumanFab : le rêve abouti de "JB"'],
  ['17', "L'AUC Padel joue l'ouverture"],
  ['24', 'Trophée France Sport : Uggo Barruol'],
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentArchives, setRecentArchives] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetch('/api/archives')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Find N°355 specifically
          const n355 = data.find(f => f.id === 355 || String(f.id) === "355");
          
          // Filter out 355 from the pool for randomization
          const others = data.filter(f => f.id !== 355 && String(f.id) !== "355");
          
          // Shuffle others manually to avoid hydration issues from random seed
          const shuffled = [...others].sort(() => 0.5 - Math.random());
          
          // Take 3 random items + n355
          const randomItems = shuffled.slice(0, 3);
          const finalSelection = n355 ? [n355, ...randomItems] : shuffled.slice(0, 4);
          
          // Final shuffle of the 4 items to make it look even more random
          setRecentArchives(finalSelection.sort(() => 0.5 - Math.random()));
        }
      })
      .catch(err => console.error("Failed to fetch archives", err));
  }, []);

  return (
    <main className="home">

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="home-hero-section">
        <div className="container">
          <div className="issue-main-highlight">
            {/* Left: Interactive Cover */}
            <div className="cover-interaction-zone" onClick={() => setIsModalOpen(true)}>
              <div className="cover-wrapper">
                <div className="cover-badge editorial-tag red">Nouveau</div>
                <img
                  src="/media/covers/current/cover-363.jpg"
                  alt="Couverture Sport Santé N°363"
                  className="cover-img"
                />
                <button className="view-sommaire-hint">
                  <span className="hint-icon">📖</span>
                  Voir le sommaire
                </button>
              </div>
            </div>

            {/* Right: Editorial Content */}
            <div className="issue-editorial-content">
              <p className="issue-meta-brand">Mars · Avril · Mai 2026 · N°363</p>
              <h1 className="main-headline reveal-on-scroll">
                Dakar 2026 — <br/>
                <span>Neels Theric</span> a tutoyé les sommets
              </h1>
              <p className="main-body-text">
                Les très remarquées performances du motard aixois Neels Theric au dernier Dakar méritent la couverture de ce n°363. Découvrez également nos coups de projecteur sur Uggo Barruol et le water polo aixois.
              </p>
              <div className="main-actions">
                <Link href="/abonnement" className="btn-editorial-dark">S'abonner au magazine</Link>
                <Link href="/kiosks" className="btn-text-link">Où nous trouver ?</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED NEWS (Dossiers) ─────────────────────────────────── */}
      <section className="home-features-section">
        <div className="container">
          <span className="section-label reveal-on-scroll">À la une</span>
          <h2 className="section-headline-bold reveal-on-scroll">Les Dossiers de la Rédaction</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-img-wrapper">
                <img src="/media/photos/bike-race.jpg" alt="Cyclisme" />
              </div>
              <span className="editorial-tag red" style={{marginBottom: '1rem'}}>Cyclisme</span>
              <h3 className="feature-title">Le Peloton Aixois : Une passion qui ne faiblit pas</h3>
            </div>
            
            <div className="feature-card">
              <div className="feature-img-wrapper">
                <img src="/media/photos/n329-salon-des-sports-3.jpg" alt="Salon des Sports" />
              </div>
              <span className="editorial-tag red" style={{marginBottom: '1rem'}}>Événement</span>
              <h3 className="feature-title">Salon des Sports : Le rendez-vous de la rentrée</h3>
            </div>

            <div className="feature-card">
              <div className="feature-img-wrapper">
                <img src="/media/photos/n329-aix-s-elance1.jpg" alt="Trail Urbain" style={{ objectPosition: 'top' }} />
              </div>
              <span className="editorial-tag red" style={{marginBottom: '1rem'}}>Athlétisme</span>
              <h3 className="feature-title">Aix s'élance : Le trail urbain séduit toujours plus</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOMMAIRE MODAL ────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            <div className="modal-header">
              <p className="modal-tag">Au Sommaire</p>
              <h2 className="modal-title">N°363 — Printemps 2026</h2>
            </div>
            <div className="modal-grid">
              <div className="modal-cover-mini">
                <img src="/media/covers/current/cover-363.jpg" alt="Cover" />
              </div>
              <ul className="modal-sommaire-list">
                {sommaire.map(([num, title]) => (
                  <li key={num} className="modal-sommaire-item">
                    <span className="page-num">P.{num}</span>
                    <span className="page-title">{title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── EDITORIAL ─────────────────────────────────────────────── */}
      <section className="edito-section-modern reveal-on-scroll">
        
        <div className="container">
          <div className="edito-grid">
            <div className="edito-portrait" style={{ backgroundImage: "url('/media/photos/n328-sport-sante-1.jpg')" }} />
            
            <div className="edito-content">
              <span className="edito-label-alt">Le mot de la rédaction</span>
              <h3 className="edito-heading-large">La capacité d'assumer vos ambitions</h3>
              <div className="edito-text-prose">
                <p>
                  « J'ai de l'estime et du respect pour les gens qui assument. » Dans le sport, la plupart des clubs doivent leur bonne santé à la capacité de ses dirigeants à assumer. 
                </p>
                <p>
                  Ce magazine a toujours accordé une place importante à ces passionnés qui entreprennent dans le domaine du sport aixois.
                </p>
              </div>
              <p className="edito-signature">— A. Crespi, <span>Directeur de la publication</span></p>
            </div>
          </div>
        </div>

      </section>
      {/* ── ARCHIVE PREVIEW ─────────────────────────────────────────── */}
      <section className="home-archives-preview">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-label reveal-on-scroll section-label-left">Collection</span>
              <h2 className="section-headline-bold reveal-on-scroll section-headline-left">Exploration des Archives</h2>
            </div>
            <Link href="/archives" className="btn-text-link">Voir toute la collection →</Link>
          </div>

          <div className="archive-preview-grid">
            {isClient && recentArchives?.length > 0 ? recentArchives.map((file, i) => (
              <div key={file.id || i} className="archive-mini-card">
                <Link href={file.pdfUrl} target="_blank">
                  <div className="archive-mini-card-inner">
                    <div className="archive-mini-badge editorial-tag red">N°{file.id}</div>
                    <img 
                      src={file.src} 
                      alt={file.title} 
                      className="archive-mini-img"
                    />
                  </div>
                </Link>
              </div>
            )) : (
              // Fallback skeleton
              Array(4).fill(0).map((_, i) => (
                <div key={i} style={{ height: '310px', background: '#f5f5f5', borderRadius: '4px' }}></div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ──────────────────────────────────────────────── */}
      <section className="cta-modern">
        <div className="container">
          <div className="cta-box">
            <div className="cta-text">
              <h2 className="cta-h2-large">Ne manquez plus aucun numéro.</h2>
              <p className="cta-p-small">Recevez Sport Santé directement dans votre boîte aux lettres.</p>
            </div>
            <Link href="/abonnement" className="btn-editorial-white">S'abonner maintenant</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
