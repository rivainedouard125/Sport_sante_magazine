'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import './Header.css';

const headerImages = [
  '/header/header-1.jpg',
  '/header/header-2.jpg',
  '/header/header-3.jpg',
  '/header/header-4.jpg',
  '/header/header-5.jpg',
  '/header/header-6.jpg',
  '/header/header-7.jpg',
  '/header/header-8.jpg',
  '/header/header-9.jpg',
];

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/magazine', label: 'Le magazine' },
  { href: '/kiosks', label: 'Où trouver' },
  { href: '/abonnement', label: 'Abonnement' },
  { href: '/photos', label: 'Photos' },
  { href: '/archives', label: 'Archives' },
  { href: '/contact', label: 'Contact' },
];

// Split links for the masthead (3 | LOGO | 4)
const leftLinks = navLinks.slice(0, 3);
const rightLinks = navLinks.slice(3);

export default function Header() {
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [weather, setWeather] = useState({ temp: '8', desc: 'ENSOLEILLÉ', icon: '☀️' });

  useEffect(() => {
    setCurrentIndex(Math.floor(Math.random() * headerImages.length));
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headerImages.length);
    }, 5500);
    
    // Set initial date
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('fr-FR', options));

    // Live Weather Fetch (Aix-en-Provence)
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://wttr.in/Aix-en-Provence?format=j1');
        const data = await res.json();
        const current = data.current_condition[0];
        
        const descMap = {
          'Clear': { txt: 'CIEL DÉGAGÉ', icon: '☀️' },
          'Sunny': { txt: 'ENSOLEILLÉ', icon: '☀️' },
          'Partly cloudy': { txt: 'ÉCLAIRCIES', icon: '⛅' },
          'Cloudy': { txt: 'NUAGEUX', icon: '☁️' },
          'Overcast': { txt: 'COUVERT', icon: '☁️' },
          'Patchy rain possible': { txt: 'RISQUE D\'AVERSES', icon: '🌦️' },
          'Light rain': { txt: 'PLUIE LÉGÈRE', icon: '🌧️' },
          'Rain': { txt: 'PLUIE', icon: '🌧️' },
        };

        const engDesc = current.weatherDesc[0].value;
        const mapped = descMap[engDesc] || { txt: engDesc.toUpperCase(), icon: '⛅' };

        setWeather({
          temp: current.temp_C,
          desc: mapped.txt,
          icon: mapped.icon
        });
      } catch (err) {
        console.warn("Weather fetch failed, using fallback.", err);
      }
    };
    
    fetchWeather();

    return () => clearInterval(interval);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      {/* ─── MASTHEAD TOP BAR — Metadata & Context ──────────────────── */}
      <div className="masthead-metadata">
        <div className="metadata-inner">
          <div className="meta-left">
            <span className="meta-item">AIX-EN-PROVENCE, FRANCE</span>
            <span className="meta-sep">|</span>
            <span className="meta-item">{currentDate}</span>
          </div>
          
          <div className="meta-center desktop-only">
             <span className="meta-tagline font-serif">Le bimestriel du sport aixois — Fondé en 1972</span>
          </div>

          <div className="meta-right">
            <div className="weather-widget">
              <span className="weather-icon">{weather.icon}</span>
              <span className="weather-temp">{weather.temp}°C</span>
              <span className="weather-desc">{weather.desc}</span>
            </div>
            <span className="meta-sep desktop-only">|</span>
            <span className="meta-item desktop-only">ÉDITION N° 363</span>
          </div>
        </div>
      </div>

      {/* ─── MAIN MASTHEAD — Branding & Nav ───────────────────────── */}
      <div className="top-bar">
        <div className="top-bar-inner">
          {/* Left Nav */}
          <nav className="site-nav desktop-only">
            <div className="nav-links">
              {leftLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link${pathname === href ? ' active' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          {/* CENTER LOGO */}
          <div className="site-logo-container">
            <Link href="/">
              <img src="/logo.png" alt="Sport Santé" className="site-logo" />
            </Link>
          </div>

          {/* Right Nav */}
          <nav className="site-nav desktop-only">
            <div className="nav-links">
              {rightLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link${pathname === href ? ' active' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Burger Toggle */}
          <button
            className={`burger-toggle ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <div className={`mobile-nav-overlay ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-nav-links">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`mobile-nav-link${pathname === href ? ' active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FLOATING SUBSCRIBE TAB */}
      <Link href="/abonnement" className="subscribe-tab">
        <div className="tab-inner">
          <span className="tab-label">ABONNEZ-VOUS</span>
        </div>
      </Link>

      {/* MEDIA GALLERY */}
      <div className="hero-gallery">
        {headerImages.map((src, idx) => (
          <div
            key={src}
            className={`hero-slide ${idx === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}

        <div className="hero-overlay-shadow" />
        <div className="hero-overlay-vignette" />
        
        {/* Caption Overlay */}
        <div className="hero-caption">
          <span className="caption-text">Sport Santé Magazine — L'excellence du sport en Provence</span>
        </div>
      </div>

    </header>
  );
}
