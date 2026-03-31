import './abonnement.css';

export const metadata = {
  title: 'Abonnement | Sport Santé Magazine',
  description: 'Rejoignez nos 70% de lecteurs fidèles et abonnez-vous à Sport Santé, le magazine du sport aixois.',
};

export default function AbonnementPage() {
  return (
    <main className="abo-page">
      
      {/* ── TITLE BAR ────────────────────────────────────────────────── */}
      <section className="page-header">
        <div className="container">
          <span className="editorial-tag red">Magazine</span>
          <h1>Abonnement</h1>
        </div>
      </section>

      {/* ── INTRO: CONTEXT & STATS ───────────────────────────────────── */}
      <section className="abo-intro">
        <div className="container abo-intro-grid">
          <div className="abo-intro-text">
            <h2>Une diffusion centrée sur nos lecteurs.</h2>
            <p>
              Si une partie de la diffusion se fait en vente directe auprès des clubs, 
              la formule par abonnement est depuis longtemps notre priorité absolue.
              Elle est le gage de notre pérennité et de notre lien direct avec vous.
            </p>
          </div>
          <div className="abo-stat-box">
            <span className="abo-stat-num">70%</span>
            <span className="abo-stat-label">de nos lecteurs sont abonnés</span>
          </div>
        </div>
      </section>

      {/* ── FORMULAS: CLEAN CARDS ────────────────────────────────────── */}
      <section className="abo-plans">
        <div className="container plans-wrapper">
          <div className="plans-side-label">Formules</div>
          <div className="plans-grid">
            
            <div className="plan-card">
              <h3>Formule Annuelle</h3>
              <div className="plan-price">20€ <span>/ an</span></div>
              <p>Recevez les 6 numéros bimestriels de Sport-Santé directement dans votre boîte aux lettres.</p>
            </div>

            <div className="plan-card support">
              <span className="support-tag">Le plus choisi</span>
              <h3>Formule de Soutien</h3>
              <div className="plan-price">30€+ <span>/ an</span></div>
              <p>Aidez activement le magazine à perdurer tout en bénéficiant de votre abonnement annuel.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── INSTRUCTIONS: STEP BY STEP ───────────────────────────────── */}
      <section className="abo-guide">
        <div className="container">
          
          <div className="guide-steps">
            <div className="step">
              <div className="step-header">
                <span className="step-num">01</span>
                <h4>Télécharger</h4>
              </div>
              <p>Récupérez le bulletin d'abonnement officiel au format PDF via le bouton ci-dessous.</p>
            </div>

            <div className="step">
              <div className="step-header">
                <span className="step-num">02</span>
                <h4>Remplir</h4>
              </div>
              <p>Imprimez et complétez le bulletin avec vos coordonnées et la formule choisie.</p>
            </div>

            <div className="step">
              <div className="step-header">
                <span className="step-num">03</span>
                <h4>Envoyer</h4>
              </div>
              <p>Postez le tout avec votre chèque à l'adresse du siège : 14 rue Pavillon, 13100 Aix-en-Provence.</p>
            </div>
          </div>

          <div className="abo-download">
             <div className="bulletin-preview">
               <img src="/media/photos/bulletin-abonnement.png" alt="Bulletin d'abonnement Sport-Santé" className="bulletin-img" />
             </div>
             
             <a href="#" className="btn-editorial-dark">
               Bulletin PDF d'abonnement <span className="arrow">→</span>
             </a>
          </div>

        </div>
      </section>

    </main>
  );
}
