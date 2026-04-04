'use client';

import { useState, useEffect } from 'react';
import PdfCoverThumb from '@/components/PdfCoverThumb';
import './archives.css';

export default function ArchivesPage() {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState('Tous');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadArchives() {
      try {
        const res = await fetch('/api/archives');
        if (!res.ok) throw new Error('Erreur de connection au Cloud');
        const data = await res.json();
        setArchives(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load archives:', err);
        setError("Les archives ne sont pas encore connectées au Cloud Vercel. Veuillez vérifier votre onglet Storage.");
        setLoading(false);
      }
    }
    loadArchives();
  }, []);

  const yearsInArchives = archives.length > 0 
    ? ['Tous', ...new Set(archives.map(a => a.year))].sort((a, b) => b - a)
    : ['Tous'];

  const filteredArchives = activeYear === 'Tous' 
    ? archives 
    : archives.filter(a => a.year === activeYear);

  return (
    <main className="archive-page">
      
      {/* ── HEADER ────────────────────────────────────────────── */}
      <section className="archive-title-bar">
        <div className="container">
          <span className="editorial-tag red">Patrimoine</span>
          <h1>Archives d'Aix</h1>
          <p>Explorez plus de 50 ans de reportages et d'histoires sportives.</p>
        </div>
      </section>

      {/* ── FILTER TABS ───────────────────────────────────────── */}
      <section className="archive-filters">
        <div className="container">
          <div className="filter-list">
            {yearsInArchives.map(year => (
              <button 
                key={year} 
                className={`filter-btn ${activeYear === year ? 'active' : ''}`}
                onClick={() => setActiveYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID ─────────────────────────────────────────────── */}
      <section className="archive-grid-section">
        <div className="container">
          {loading && (
            <div className="archive-loading">
              <div className="loader"></div>
              <p>Chargement des archives...</p>
            </div>
          )}

          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#666', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
              <p style={{ marginBottom: '1rem' }}>{error}</p>
              <p style={{ fontSize: '0.85rem' }}>Une fois le <strong>Storage (Blob + Postgres)</strong> connecté dans Vercel, les archives s'afficheront ici.</p>
            </div>
          )}

          {!loading && !error && archives.length === 0 && (
            <div style={{ textAlign: 'center', padding: '10rem 1rem', color: '#999' }}>
              <h3>Aucune archive disponible</h3>
              <p>Utilisez l'espace Admin pour uploader votre premier magazine.</p>
            </div>
          )}

          {!loading && !error && archives.length > 0 && (
            <div className="archive-grid">
              {filteredArchives.map((mag) => (
                <article key={mag.id} className="mag-card">
                  <div className="mag-card-cover-container">
                    <div className="cover-interaction-zone">
                      <div className="cover-wrapper">
                        <div className="archive-tag editorial-tag red">N°{mag.id}</div>
                        <PdfCoverThumb
                          pdfUrl={mag.src}
                          alt={mag.title}
                          className="archive-cover-img"
                          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '2px' }}
                        />
                        <div className="mag-hover-overlay">
                          <a href={mag.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-read-pdf">
                            Lire le PDF ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mag-card-info">
                    <span className="mag-date">{mag.year}</span>
                    <h3>{mag.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CALL TO ACTION FOR OLDER ISSUES ───────────────────── */}
      <section className="archive-cta">
        <div className="container">
          <div className="cta-box">
            <h2>À la recherche d'un numéro spécifique ?</h2>
            <p>Certaines archives papiers des années 80 et 90 sont accessibles au siège sur demande.</p>
            <a href="/contact" className="btn-contact-archives">Contacter l'archiviste</a>
          </div>
        </div>
      </section>

    </main>
  );
}
