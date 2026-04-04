'use client';

import { useState, useEffect } from 'react';
import './photos.css';

export default function PhotosPage() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/photos')
      .then(r => r.json())
      .then(data => {
        setIssues(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openLightbox  = img => setSelectedImg(img);
  const closeLightbox = ()  => setSelectedImg(null);

  return (
    <main className="photos-page">

      {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
      <section className="page-header">
        <div className="container">
          <span className="editorial-tag red" style={{ marginBottom: '1rem' }}>Archives Publiques</span>
          <h1>Photothèque</h1>
        </div>
      </section>

      {/* ── HERO: SERVICES ───────────────────────────────────────────── */}
      <section className="photos-hero">
        <div className="photos-hero-bg"></div>
        <div className="container photos-hero-content">
          <div className="services-grid">

            <div className="service-card subscriber">
              <span className="editorial-tag">Privilège</span>
              <h2>Acquérir une photo numérique en Haute Définition</h2>
              <p>
                Abonnés de Sport-Santé ? Nous vous offrons le fichier numérique
                haute résolution sur simple demande par e-mail.
              </p>
              <a href="mailto:contact@sport-sante-magazine.fr?subject=Demande Photo Numérique" className="btn-editorial-dark">Demander un fichier</a>
            </div>

            <div className="service-card print">
              <span className="editorial-tag">Boutique</span>
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

      {/* ── GALLERY BY ISSUES ────────────────────────────────────────── */}
      <section className="photos-by-issue">
        <div className="container">

          {loading && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#999' }}>
              Chargement de la photothèque…
            </div>
          )}

          {!loading && issues.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#999' }}>
              Aucune photo disponible pour le moment.
            </div>
          )}

          {issues.map((group) => (
            <div key={group.edition} className="issue-segment">

              <header className="issue-header">
                <div className="issue-label">
                  {group.edition !== 'general' && (
                    <span className="num-watermark">{group.edition}</span>
                  )}
                  <div className="issue-meta">
                    <span className="editorial-tag red">
                      {group.edition === 'general' ? 'Galerie Générale' : `Sport-Santé N°${group.edition}`}
                    </span>
                    <h2 className="issue-mag-title">
                      {group.edition === 'general'
                        ? `${group.photos.length} photo(s)`
                        : `${group.photos.length} photo(s) — Édition N°${group.edition}`}
                    </h2>
                  </div>
                </div>
                <div className="issue-actions">
                  <a
                    href="https://www.jingoo.com/album/postershop/index.php?id_photographe=143401"
                    className="btn-editorial-dark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Voir toute la série
                  </a>
                </div>
              </header>

              <div className="issue-grid">
                {group.photos.map((photo, pIdx) => (
                  <div key={pIdx} className="modern-photo-card" onClick={() => openLightbox(photo)}>
                    <div className="photo-inner">
                      <img src={photo.src} alt={photo.label} loading="lazy" />
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

      {/* ── FOOTER CTA ───────────────────────────────────────────────── */}
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

      {/* ── LIGHTBOX ─────────────────────────────────────────────────── */}
      {selectedImg && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
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
