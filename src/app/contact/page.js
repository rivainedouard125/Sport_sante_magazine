'use client';
import { useState } from 'react';
import './contact.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `Contact depuis le site - ${formData.name}`;
    const body = `Nom: ${formData.name}\nEmail: ${formData.email}\nTéléphone: ${formData.phone}\n\nMessage:\n${formData.message}`;
    const mailtoUrl = `mailto:sport-sante@wanadoo.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <main className="contact-page">
      {/* ── EDITORIAL HEADER ────────────────────────────────────── */}
      <section className="page-header">
        <div className="container">
          <span className="editorial-tag red" style={{ marginBottom: '1rem' }}>Aix-en-Provence</span>
          <h1>Contact</h1>
        </div>
      </section>

      <div className="container">

        {/* ── MAIN GRID ───────────────────────────────────────────── */}
        <div className="contact-editorial-grid">
          
          {/* ── SIDEBAR INFO ──────────────────────────────────────── */}
          <aside className="contact-sidebar">
            <div className="sidebar-block">
              <h3>Bureaux Aix-Presse</h3>
              <p className="sidebar-content">
                14 rue Pavillon<br />
                13100 Aix-en-Provence
              </p>
            </div>

            <div className="sidebar-block">
              <h3>Correspondance</h3>
              <p className="sidebar-content">
                <a href="mailto:sport-sante@wanadoo.fr">sport-sante@wanadoo.fr</a>
              </p>
            </div>

            <div className="sidebar-block">
              <h3>Lignes Directes</h3>
              <p className="sidebar-content">
                Siège : 04.42.38.42.37<br />
                Portable : 06.84.16.82.24
              </p>
            </div>
          </aside>

          {/* ── FORM CONTENT ──────────────────────────────────────── */}
          <section className="contact-main-form">
            <h2>Écrivez-nous</h2>
            <form className="form-packed" onSubmit={handleSubmit}>
              <div className="form-group-packed">
                <label className="f-label">Nom complet (requis)</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="f-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="JEAN DUPONT"
                />
              </div>

              <div className="form-group-packed">
                <label className="f-label">Adresse de contact (requis)</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="f-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="JEAN.DUPONT@EXEMPLE.COM"
                />
              </div>

              <div className="form-group-full">
                <label className="f-label">Téléphone (Optionnel)</label>
                <input 
                  type="tel" 
                  name="phone" 
                  className="f-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 01 02 03 04"
                />
              </div>

              <div className="form-group-full">
                <label className="f-label">Votre message</label>
                <textarea 
                  name="message" 
                  rows="6" 
                  required 
                  className="f-textarea"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="VOTRE MESSAGE ICI..."
                ></textarea>
              </div>

              <button type="submit" className="btn-editorial-dark" style={{ gridColumn: 'span 2', marginTop: '2rem' }}>
                Envoyer le message →
              </button>
            </form>
          </section>

        </div>
      </div>
    </main>
  );
}
