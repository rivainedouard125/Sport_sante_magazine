import './kiosks.css';

export const metadata = {
  title: 'Où trouver Sport Santé | Sport Santé Magazine',
  description: 'Découvrez les points de vente du magazine Sport Santé à Aix-en-Provence et ses environs.',
};

export default function KiosksPage() {
  return (
    <main className="kiosks-page">
      
      {/* ── TITLE BAR ────────────────────────────────────────────────── */}
      <section className="page-header">
        <div className="container">
          <span className="editorial-tag red">Points de vente</span>
          <h1>Où le trouver ?</h1>
        </div>
      </section>

      {/* ── HERO: PRICE & CONTEXT ────────────────────────────────────── */}
      <section className="kiosks-hero">
        <div className="kiosks-hero-bg"></div>
        <div className="container kiosks-hero-content">
          <div className="price-tag">5.00€</div>
          <span className="price-label">Prix au numéro</span>
          <p className="hero-description">
            Sport-Santé est distribué en kiosques de manière limitée. 
            Découvrez ci-dessous les points de vente les plus fiables pour vous procurer votre exemplaire.
          </p>
        </div>
      </section>

      {/* ── LOCATIONS: CENTRE vs PÉRI-URBAIN ─────────────────────────── */}
      <section className="locations-section">
        <div className="container locations-split">
          
          <div className="locations-sidebar">
            <h2 className="sec-title">Points de <br/>distribution</h2>
            <p className="sec-subtitle">
              Une sélection de points de vente stratégiques au cœur d'Aix-en-Provence 
              et dans les communes limitrophes.
            </p>
          </div>

          <div className="locations-grid">
            <div className="location-item">
              <h3>Centre-ville d'Aix</h3>
              <ul>
                <li><strong>Kiosque Prêcheurs :</strong> Place des Prêcheurs</li>
                <li><strong>Kiosque Mirabeau :</strong> Bas du Cours Mirabeau</li>
              </ul>
            </div>

            <div className="location-item">
              <h3>Périphérie d'Aix</h3>
              <ul>
                <li><strong>Venelles :</strong> Plusieurs diffuseurs de presse</li>
                <li><strong>Puyricard :</strong> Diffuseur de presse local</li>
                <li><strong>Luynes :</strong> Diffuseur de presse local</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ── SEAT & CONTACT ───────────────────────────────────────────── */}
      <section className="contact-banner">
        <div className="container">
          <div className="contact-box">
            <h2>Vous ne le trouvez pas ?</h2>
            <p>
              Pour tout autre point de vente ou pour une commande spécifique, 
              veuillez contacter directement le siège de Sport-Santé.
            </p>
            <a href="tel:0442384237" className="phone-link">04 42 38 42 37</a>
            <span className="address-label">SARL AIX-PRESSE — 14 rue Pavillon, Aix-en-Provence</span>
          </div>
        </div>
      </section>

    </main>
  );
}
