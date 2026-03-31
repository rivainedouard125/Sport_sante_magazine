'use client';

import { useState } from 'react';
import './photos.css';

export default function PhotosPage() {
  const [selectedImg, setSelectedImg] = useState(null);

  const issues = [
    {
      number: '329',
      title: 'Edition Printemps 2024',
      photos: [
        { src: '/media/photos/n329-salon-des-sports-31.jpg', label: 'Salon des Sports Aix' },
        { src: '/media/photos/n329-aix-s-elance1.jpg', label: "Aix s'élance" },
        { src: '/media/photos/n329-enduranne-13.jpg', label: 'E-Running Enduranne' },
        { src: '/media/photos/n329-salon-des-sports-38.jpg', label: 'Démonstration Aïkido' },
        { src: '/media/photos/n329-aix-s-elance4.jpg', label: 'Course de Ligue' },
        { src: '/media/photos/n329-salon-des-sports-3.jpg', label: 'Village des Associations' },
      ]
    },
    {
      number: '328',
      title: 'Edition Hiver 2023',
      photos: [
        { src: '/media/photos/n328-sport-sante-16.jpg', label: 'Grand Prix Cycliste' },
        { src: '/media/photos/n328-sport-sante-2.jpg', label: 'Handball Pro - PAUC' },
        { src: '/media/photos/n328-sport-sante-17.jpg', label: 'Escrime - Tournoi Sabatier' },
        { src: '/media/photos/n328-sport-sante-1.jpg', label: 'Natation - Meeting Aix' },
        { src: '/media/photos/n328-sport-sante-18.jpg', label: 'Rugby - Stade Maurice David' },
        { src: '/media/photos/n328-sport-sante-3.jpg', label: 'Escrime - Podium' },
      ]
    }
  ];

  const openLightbox = (img) => setSelectedImg(img);
  const closeLightbox = () => setSelectedImg(null);

  return (
    <main className="photos-page">
      
      {/* ── PAGE HEADER ────────────────────────────────────────────── */}
      <section className="page-header">
        <div className="container">
          <span className="editorial-tag red" style={{ marginBottom: '1rem' }}>Archives Publiques</span>
          <h1>Photothèque</h1>
        </div>
      </section>

      {/* ── HERO: SERVICES ─────────────────────────────────────────── */}
      <section className="photos-hero">
        <div className="photos-hero-bg"></div>
        <div className="container photos-hero-content">
          <div className="services-grid">
            
            <div className="service-card subscriber">
              <span className="editorial-tag red">Privilège</span>
              <h2>Acquérir une photo numérique en Haute Définition</h2>
              <p>
                Abonnés de Sport-Santé ? Nous vous offrons le fichier numérique 
                haute résolution sur simple demande par e-mail.
              </p>
              <a href="mailto:contact@sport-sante-magazine.fr?subject=Demande Photo Numérique" className="btn-editorial-dark">Demander un fichier</a>
            </div>

            <div className="service-card print">
              <span className="editorial-tag red">Boutique</span>
              <h2>Acheter un tirage papier de qualité professionnelle</h2>
              <p>
                Gardez un souvenir impérissable de vos exploits avec des tirages papier 
                professionnels disponibles sur notre boutique Jingoo.
              </p>
              <a 
                href="https://www.jingoo.com/album/postershop/index.php?id_photographe=143401" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-editorial-white"
              >
                Accéder aux Galeries ↗
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── GALLERY BY ISSUES ──────────────────────────────────────── */}
      <section className="photos-by-issue">
        <div className="container">
          
          {issues.map((issue) => (
            <div key={issue.number} className="issue-segment">
              
              <header className="issue-header">
                <div className="issue-label">
                  <span className="num-watermark">{issue.number}</span>
                  <div className="issue-meta">
                    <span className="editorial-tag red">Sport-Santé N°{issue.number}</span>
                    <h2 className="issue-mag-title">{issue.title}</h2>
                  </div>
                </div>
                <div className="issue-actions">
                   <a href="https://www.jingoo.com/album/postershop/index.php?id_photographe=143401" className="btn-editorial-dark">
                     Voir toute la série
                   </a>
                </div>
              </header>

              <div className="issue-grid">
                {issue.photos.map((photo, pIdx) => (
                  <div key={pIdx} className="modern-photo-card" onClick={() => openLightbox(photo)}>
                    <div className="photo-inner">
                      <img src={photo.src} alt={photo.label} />
                      <div className="photo-hover-pane">
                        <span className="photo-event-label">{photo.label}</span>
                        <div className="photo-cta">Agrandir</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* ── FOOTER CTA ──────────────────────────────────────────────── */}
      <section className="gallery-footer-final">
        <div className="container">
          <h3>Retrouvez l'intégralité de nos archives</h3>
          <p>Plus de 50 ans de sport aixois à portée de clic.</p>
          <a 
            href="https://www.jingoo.com/album/postershop/index.php?id_photographe=143401" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-editorial-dark"
          >
            Explorer les 10,000+ photos sur Jingoo
          </a>
        </div>
      </section>

      {/* ── LIGHTBOX PORTAL ────────────────────────────────────────── */}
      {selectedImg && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
            <div className="lightbox-img-box">
              <img src={selectedImg.src} alt={selectedImg.label} />
              <div className="lightbox-caption">
                <span className="editorial-tag red">Sport-Santé Archive</span>
                <h3>{selectedImg.label}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
