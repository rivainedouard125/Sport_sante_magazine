import React from 'react';
import './SidebarAds.css';

const ads = [
  { src: '/media/ads/1.jpg', alt: 'Mairie Aix-en-Provence', link: 'http://www.mairie-aixenprovence.fr' },
  { src: '/media/ads/4.jpg', alt: 'France Sport', link: 'http://www.france-sport.fr/' },
  { src: '/media/ads/6.jpg', alt: 'Agglo Pays Aix', link: 'http://www.agglo-paysdaix.fr' },
  { src: '/media/ads/7.jpg', alt: 'Igol', link: 'http://www.igol.com/' },
  { src: '/media/ads/8.png', alt: 'Département 13', link: 'https://www.departement13.fr/' },
  { src: '/media/ads/9.png', alt: 'Sylvain Sauvage', link: 'http://www.sylvainsauvage13.com/' },
  { src: '/media/ads/10.png', alt: 'Ste Chauvin', link: 'http://stechauvin.com/' },
  { src: '/media/ads/eurlirent.png', alt: 'EurliRent', link: 'http://www.eurlirent.com/' }
];

export default function SidebarAds() {
  return (
    <aside className="sidebar-ads-container">
      <div className="sidebar-ads-sticky">
        <h4 className="sidebar-ads-title">Nos Partenaires</h4>
        <div className="sidebar-ads-grid">
          {ads.map((ad, idx) => (
            <a key={idx} href={ad.link} target="_blank" rel="noopener noreferrer" className="sidebar-ad-card reveal-on-scroll" style={{transitionDelay: `${idx * 0.1}s`}}>
              <img src={ad.src} alt={ad.alt} className="sidebar-ad-img" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
