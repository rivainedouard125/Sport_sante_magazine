'use client';

export default function Sommaire({ sommaire, issueNumber }) {
  if (!sommaire || sommaire.length === 0) return null;

  // Split sommaire into two columns for desktop
  const midPoint = Math.ceil(sommaire.length / 2);
  const leftCol = sommaire.slice(0, midPoint);
  const rightCol = sommaire.slice(midPoint);

  return (
    <section className="sommaire-full-section">
      <div className="container">
        <div className="sommaire-editorial-wrapper">
          
          <div className="sommaire-intro">
            <span className="editorial-tag red">Sommaire</span>
            <h2 className="sommaire-main-title">Édition N°{issueNumber}</h2>
            <div className="sommaire-divider"></div>
          </div>

          <div className="sommaire-grid-layout">
            {/* COLUMN 1 */}
            <div className="sommaire-column">
              {leftCol.map((item, idx) => (
                <div key={idx} className="sommaire-row">
                  <span className="sommaire-entry-title">{item.text}</span>
                  <span className="sommaire-leader"></span>
                  <span className="sommaire-entry-page">p.{item.page || (idx + 1)}</span>
                </div>
              ))}
            </div>

            {/* COLUMN 2 */}
            <div className="sommaire-column">
              {rightCol.map((item, idx) => (
                <div key={idx + midPoint} className="sommaire-row">
                  <span className="sommaire-entry-title">{item.text}</span>
                  <span className="sommaire-leader"></span>
                  <span className="sommaire-entry-page">p.{item.page || (idx + midPoint + 1)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sommaire-footer-rule"></div>
        </div>
      </div>
    </section>
  );
}
