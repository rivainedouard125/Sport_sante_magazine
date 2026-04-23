'use client';

import Image from 'next/image';
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
                <Image src={data.coverSrc} alt={`Sport Santé N°${data.issueNumber}`} width={600} height={800} className="cover-img" priority />
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
            {data.dossiers && data.dossiers.map((dos, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-img-wrapper">
                  <Image src={dos.imageSrc || '/media/photos/n329-salon-des-sports-31.jpg'} alt="Dossier" fill style={{ objectFit: 'cover' }} />
                </div>
                <span className="editorial-tag">{dos.tag}</span>
                <h3 className="feature-title">{dos.title}</h3>
              </div>
            ))}
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
