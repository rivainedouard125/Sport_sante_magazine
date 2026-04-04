'use client';

import { useState } from 'react';
import SidebarAds from '@/components/SidebarAds';
import PdfCoverThumb from '@/components/PdfCoverThumb';
import './home.css';

export default function HomeContent({ data }) {
  const [showSommaire, setShowSommaire] = useState(false);

  return (
    <div className="home">
      
      {/* ── SECTION: MASTHEAD (Hero + Sidebar) ───────────────────── */}
      <section className="home-hero-section">
        <div className="home-grid-layout container">
          
          <div className="home-main-column">
            
            {/* THE HERO HIGHLIGHT */}
            <div className="issue-main-highlight">
              
              {/* Cover with Modal Interaction */}
              <div className="cover-interaction-zone" onClick={() => setShowSommaire(true)}>
                <div className="cover-wrapper">
                  <span className="editorial-tag red cover-badge">N°{data.issueNumber}</span>
                  <img src={data.coverSrc} alt={`Sport Santé N°${data.issueNumber}`} className="cover-img" />
                  <div className="view-sommaire-hint">
                    <span>Voir le Sommaire</span>
                    <i className="arrow-icon">→</i>
                  </div>
                </div>
              </div>

              {/* Headlines */}
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
                  <button className="btn-text-link" onClick={() => setShowSommaire(true)}>Voir le Sommaire →</button>
                </div>
              </div>
            </div>

            {/* ── SECTION: DOSSIERS (The News Grid) ───────────────── */}
            <section className="home-features-section">
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
            </section>

          </div>

          {/* THE SIDEBAR ADS (Sticky Right Column) */}
          <aside className="home-sidebar">
            <SidebarAds />
          </aside>

        </div>
      </section>

      {/* ── SECTION: MOT DE LA RÉDACTION (Elegant Banner) ────────── */}
      <section className="edito-section-modern">
        <div className="container">
          <div className="edito-grid">
            <div className="edito-portrait"></div>
            <div className="edito-content">
              <span className="edito-label-alt">Éditorial</span>
              <h2 className="edito-heading-large">La capacité d'assumer vos ambitions</h2>
              <div className="edito-text-prose">
                <p>Depuis plus de 40 ans, Sport Santé Magazine accompagne les Aixois dans leur quête d’excellence et de bien-être.</p>
                <p>Chaque numéro est une invitation à repousser vos limites, que vous soyez athlète confirmé ou amateur passionné.</p>
              </div>
              <div className="edito-signature">
                Édouard Rivain <span>Directeur de la Rédaction</span>
              </div>
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
            <div className="archive-mini-card">
               <div className="archive-mini-card-inner">
                  <PdfCoverThumb pdfUrl="/media/archives/2026/SportSante_364.pdf" className="archive-mini-img" />
               </div>
            </div>
            <div className="archive-mini-card">
               <div className="archive-mini-card-inner">
                  <PdfCoverThumb pdfUrl="/media/archives/2025/SportSante_360.pdf" className="archive-mini-img" />
               </div>
            </div>
            <div className="archive-mini-card">
               <div className="archive-mini-card-inner">
                  <PdfCoverThumb pdfUrl="/media/archives/2024/SportSante_329.pdf" className="archive-mini-img" />
               </div>
            </div>
            <div className="archive-mini-card">
               <div className="archive-mini-card-inner">
                  <PdfCoverThumb pdfUrl="/media/archives/2023/SportSante_328.pdf" className="archive-mini-img" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL: SOMMAIRE ────────────────────────────────────────── */}
      {showSommaire && (
        <div className="modal-overlay" onClick={() => setShowSommaire(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSommaire(false)}>&times;</button>
            
            <header className="modal-header">
              <span className="modal-tag">Sommaire Édition N°{data.issueNumber}</span>
              <h2 className="modal-title">{data.issueDate}</h2>
            </header>

            <div className="modal-grid">
              <div className="modal-cover-mini">
                <img src={data.coverSrc} alt="Cover" />
              </div>
              <ul className="modal-sommaire-list">
                {data.sommaire.map((item, idx) => (
                  <li key={idx} className="modal-sommaire-item">
                    <span className="page-num">{(idx + 1) * 4}</span>
                    <span className="page-title">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
