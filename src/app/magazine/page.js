import Link from 'next/link';
import './magazine.css';

export const metadata = {
  title: 'Le magazine | Sport Santé Magazine',
  description: 'Découvrez l\'histoire et la vocation de Sport Santé, le magazine du sport aixois depuis 1972.',
};

export default function MagazinePage() {
  return (
    <main className="mag-page">

      {/* ── PAGE TITLE BAR ─────────────────────────────────────────────── */}
      <section className="page-header">
        <div className="container">
          <span className="editorial-tag red reveal-on-scroll">Depuis 1972</span>
          <h1 className="reveal-on-scroll">Le Magazine</h1>
        </div>
      </section>

      {/* ── HERO: COVERS + INTRO TEXT ──────────────────────────────────── */}
      <section className="mag-hero">
        <div className="container mag-hero-grid">

          {/* Stacked covers */}
          <div className="covers-stack">
            <img
              src="/media/covers/historical/N100-1982.jpg"
              alt="Sport-Santé N°100 — 1982"
              className="cover back"
            />
            <img
              src="/media/covers/historical/N1-1972.jpg"
              alt="Sport-Santé N°1 — 1972"
              className="cover front"
            />
            <span className="editorial-tag tag-old">N°1 · 1972</span>
            <span className="editorial-tag tag-new">N°100 · 1982</span>
          </div>

          {/* Intro text */}
          <div className="mag-intro">
            <p className="intro-lead">
              <strong>Sport-Santé</strong>, magazine du sport aixois, a été créé il y a plus de 50 ans. Le N°1 est paru en <em>octobre 1972</em>.
            </p>
            <p>
              Publié par la SARL AIX-PRESSE, dont le siège est situé 14 rue Pavillon à Aix-en-Provence, ce magazine a été mensuel jusqu'au début des années 90, avant de prendre la périodicité bimestrielle en 1992.
            </p>

            <blockquote className="vocation">
              <strong>Notre Vocation</strong>
              <span>Promouvoir le sport aixois sous toutes ses formes, par la mise en évidence du travail effectué dans les clubs et des performances individuelles et collectives des sportifs aixois.</span>
            </blockquote>
          </div>

        </div>
      </section>

      {/* ── RUBRIQUES — horizontal ribbon ──────────────────────────────── */}
      <section className="mag-rubrics">
        <div className="container rubrics-split">
          
          {/* Side title */}
          <div className="rubrics-sidebar">
            <h2 className="sec-title reveal-on-scroll">Les rubriques <br/>« cultes »</h2>
            <p className="sec-subtitle reveal-on-scroll">Les rendez-vous fidèles qui font la spécificité de Sport-Santé depuis 50 ans.</p>
          </div>

          {/* Grid content */}
          <div className="rubrics-main-grid">
            {[
              { name: 'Le Méchant', desc: 'Le billet d\'humeur historique, sans concession mais toujours avec esprit.' },
              { name: 'Sportif du Mois', desc: 'Mise en lumière d\'un talent local qui a porté haut les couleurs d\'Aix.' },
              { name: 'Challenges', desc: 'Le palmarès de référence pour les athlètes, techniciens et clubs du pays d\'Aix.' },
              { name: 'L\'Éditorial', desc: 'La vision de la rédaction sur les enjeux et l\'avenir du sport aixois.' },
            ].map(r => (
              <div key={r.name} className="rubric-item">
                <h3>{r.name}</h3>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CHIFFRES — compact 4-col stat strip ───────────────────────── */}
      <section className="mag-stats">
        <div className="stats-parallax-bg" style={{ backgroundImage: "url('/media/photos/bike-race.jpg')" }}></div>
        <div className="stats-overlay"></div>
        <div className="container stats-row relative z-10">
          {[
            { num: '11 300', label: 'pages publiées' },
            { num: '450k', label: 'photos en archives' },
            { num: '280k', label: 'sportifs photographiés' },
            { num: '2 500', label: 'lauréats honorés' },
          ].map(s => (
            <div key={s.num} className="stat">
              <span className="stat-num">{s.num}</span>
              <span className="stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="cta-band">
        <div className="container cta-inner">
          <div className="reveal-on-scroll">
            <p className="cta-sup">Faites partie de l'histoire</p>
            <h2 className="cta-h2">Abonnez-vous à Sport Santé</h2>
          </div>
          <Link href="/abonnement" className="btn-editorial-red">Je m'abonne →</Link>
        </div>
      </section>

    </main>
  );
}
