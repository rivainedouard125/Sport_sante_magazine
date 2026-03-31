import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-bg-watermark">S</div>
      
      <div className="container footer-grid">
        {/* Column 1: Brand & Slogan */}
        <div className="footer-col brand-col">
          <Link href="/" className="footer-logo">
            <img src="/logo.png" alt="Sport Santé Magazine" className="footer-logo-img" />
          </Link>
          <p className="footer-slogan">Le bimestriel du sport aixois depuis 1972.</p>
          <div className="footer-contact-info">
            <p>14 rue Pavillon</p>
            <p>13100 Aix-en-Provence</p>
            <a href="mailto:contact@sport-sante-magazine.fr" className="footer-mail">contact@sport-sante-magazine.fr</a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col links-col">
          <h3>Navigation</h3>
          <nav className="footer-nav">
            <Link href="/">Accueil</Link>
            <Link href="/magazine">Le Magazine</Link>
            <Link href="/kiosks">Où nous trouver</Link>
            <Link href="/abonnement">Abonnement</Link>
          </nav>
        </div>

        {/* Column 3: Archives & More */}
        <div className="footer-col links-col">
          <h3>Collection</h3>
          <nav className="footer-nav">
            <Link href="/archives">Archives PDF</Link>
            <Link href="/photos">Photothèque</Link>
            <Link href="/contact">Nous contacter</Link>
            <Link href="/admin">Espace Admin</Link>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} Sport Santé Magazine. <span className="hide-mobile">Tous droits réservés.</span></p>
          <div className="footer-legal-links">
            <Link href="/mentions-legales">Mentions Légales</Link>
            <Link href="/cgv">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
