'use client';

import PdfCoverThumb from '@/components/PdfCoverThumb';
import Sommaire from '@/components/Sommaire';
import Editorial from '@/components/Editorial';
import './home.css';

export default function HomeContent({ data }) {
  return (
    <div className="home">
      
      {/* ── SECTION: MASTHEAD (Hero + Sidebar) ───────────────────── */}
      <section className="home-hero-section">
        <div className="container">
          
          <div className="issue-main-highlight">
            
            <div className="cover-presentation-block">
              <div className="cover-wrapper">
                <span className="editorial-tag red cover-badge">N°{data.issueNumber}</span>
                <img src={data.coverSrc} alt={`Sport Santé N°${data.issueNumber}`} className="cover-img" />
              </div>
            </div>

            <div className="issue-editorial-content">
              <span className="issue-meta-brand">Edition {data.issueDate}</span>
              <h1 className="main-headline">
                  {data.headline}
              </h1>
              <p className="main-body-text">
                {data.subheadline}
                <br /><br />
                {data.bodyText}
              </p>
              <div className="main-actions">
                <a href="/abonnement" className="btn-editorial-red">S'abonner au Magazine</a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INTEGRATED SOMMAIRE SECTION (Full Width Layout) */}
      <Sommaire sommaire={data.sommaire} issueNumber={data.issueNumber} />

      {/* ── SECTION: ÉDITORIAL (The Voice of the Issue) ─────────── */}
      <Editorial />

      {/* ── SECTION: DOSSIERS (The News Grid) ───────────────── */}
      <section className="home-features-section">
        <div className="container">
          <span className="section-label section-label-left">Les Dossiers du Trimestre</span>
          <h2 className="section-headline-bold section-headline-left">À la une de Sport-Santé</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-img-wrapper">
                <img src="/media/photos/n329-salon-des-sports-31.jpg" alt="Dossier" />
              </div>
              <span className="editorial-tag">Grand Angle</span>
              <h3 className="feature-title">Le Sport au service de la Santé Publique : Enjeux et Défis</h3>
            </div>
            <div className="feature-card">
              <div className="feature-img-wrapper">
                <img src="/media/photos/n329-aix-s-elance1.jpg" alt="Dossier" />
              </div>
              <span className="editorial-tag">Reportage</span>
              <h3 className="feature-title">Aix s'élance : Le guide complet des événements sportifs 2024</h3>
            </div>
            <div className="feature-card">
              <div className="feature-img-wrapper">
                <img src="/media/photos/n328-sport-sante-16.jpg" alt="Dossier" />
              </div>
              <span className="editorial-tag">Elite</span>
              <h3 className="feature-title">Grand Prix Cycliste : Dans les coulisses de la préparation</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: EXPLORATION DES ARCHIVES ────────────────────── */}
      <section className="home-archives-preview">
        <div className="container">
          <div className="section-header-flex">
            <div className="title-stack">
              <span className="editorial-tag red">Collection</span>
              <h2 className="section-headline-bold section-headline-left">Archives Récentes</h2>
            </div>
            <a href="/archives" className="btn-text-link">Voir toute la collection →</a>
          </div>

          <div className="archive-preview-grid">
            {data.recentArchives && data.recentArchives.length > 0 ? (
              data.recentArchives.map((mag, idx) => (
                <div key={idx} className="archive-mini-card">
                  <div className="archive-mini-card-inner">
                    <PdfCoverThumb pdfUrl={mag.pdfUrl} className="archive-mini-img" />
                    <span className="archive-mini-label">N°{mag.issueNumber}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="archive-mini-placeholder">Plus d'archives à venir...</div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
