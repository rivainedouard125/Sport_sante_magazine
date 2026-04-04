'use client';

import { useState, useEffect } from 'react';
import PdfCoverThumb from '@/components/PdfCoverThumb';
import './archives.css';

export default function ArchivesPage() {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState('Tous');

  useEffect(() => {
    async function loadArchives() {
      try {
        const res = await fetch('/api/archives');
        const data = await res.json();
        setArchives(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load archives:', error);
        setLoading(false);
      }
    }
    loadArchives();
  }, []);

  const yearsInArchives = ['Tous', ...new Set(archives.map(a => a.year))].sort((a, b) => b - a);

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
          {loading ? (
            <div className="archive-loading">
              <div className="loader"></div>
              <p>Chargement des archives...</p>
            </div>
          ) : (
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
