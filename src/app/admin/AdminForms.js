'use client';

import { useState, useEffect } from 'react';
import { updateHomePage, uploadArchive, uploadPhotos } from './actions';
import './admin.css';

// ── LIVE IMAGE PREVIEW ────────────────────────────────────────────────
function ImagePreview({ file }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!file) { setUrl(null); return; }
    const objUrl = URL.createObjectURL(file);
    setUrl(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [file]);
  if (!url) return null;
  return (
    <div style={{ marginTop: '1rem', borderRadius: '6px', overflow: 'hidden', border: '1px solid #222' }}>
      <img src={url} alt="Aperçu" style={{ width: '100%', maxHeight: '240px', objectFit: 'contain', background: '#000', display: 'block' }} />
    </div>
  );
}

// ── FILE DROP ZONE ────────────────────────────────────────────────────
function FileZone({ name, accept, hint, multiple = false, required = false, onFilesChange }) {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleChange = e => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    onFilesChange && onFilesChange(selected);
  };

  const label = files.length === 0
    ? null
    : files.length === 1
      ? files[0].name
      : `${files.length} fichiers sélectionnés`;

  return (
    <div
      className={`admin-file-zone ${files.length > 0 ? 'has-file' : ''} ${dragging ? 'dragging' : ''}`}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDrop={() => setDragging(false)}
    >
      <input
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        required={required}
        onChange={handleChange}
      />
      <div className="admin-file-icon">{files.length > 0 ? '✅' : dragging ? '📥' : '📂'}</div>
      <div className="admin-file-label">
        {label
          ? <div className="admin-file-name">{label}</div>
          : <><strong>Choisir</strong> ou glisser-déposer ici<br /><span style={{ fontSize: '0.75rem', color: '#333' }}>{hint}</span></>
        }
      </div>
    </div>
  );
}

function StatusMsg({ status }) {
  if (!status || status.pending) return null;
  return (
    <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
      {status.success ? '✓' : '✗'} {status.success ? status.message : status.error}
    </div>
  );
}

// ── TAB 1: PAGE D'ACCUEIL ─────────────────────────────────────────────
function TabHomePage() {
  const [status, setStatus] = useState(null);
  const [sommaire, setSommaire] = useState([{ page: '', title: '' }]);
  const [dossiers, setDossiers] = useState([
    { tag: 'Grand Angle', title: '', file: null },
    { tag: 'Reportage', title: '', file: null },
    { tag: 'Elite', title: '', file: null }
  ]);
  const [coverFile, setCoverFile] = useState(null);

  const addRow = () => setSommaire(s => [...s, { page: '', title: '' }]);
  const removeRow = i => setSommaire(s => s.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) =>
    setSommaire(s => s.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  const updateDossier = (i, field, val) =>
    setDossiers(d => d.map((dos, idx) => idx === i ? { ...dos, [field]: val } : dos));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ pending: true });
    const formData = new FormData(e.target);
    formData.set('sommaire', JSON.stringify(sommaire));
    
    // Add dossiers text data to formData
    formData.set('dossiersData', JSON.stringify(dossiers.map(d => ({ tag: d.tag, title: d.title }))));
    // The files are naturally included in the form via their name attributes: dossier_img_0, dossier_img_1, etc.
    
    const result = await updateHomePage(formData);
    setStatus(result);
    if (result?.success) {
      setSommaire([{ page: '', title: '' }]);
      setDossiers([
        { tag: 'Grand Angle', title: '', file: null },
        { tag: 'Reportage', title: '', file: null },
        { tag: 'Elite', title: '', file: null }
      ]);
      setCoverFile(null);
      e.target.reset();
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2 className="admin-panel-title">Page d'accueil</h2>
        <p className="admin-panel-desc">
          Mettez à jour le numéro affiché en une : couverture, texte éditorial et sommaire.
        </p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* Identité */}
        <div className="admin-form-card">
          <div className="admin-form-card-title">Identité du numéro</div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Numéro</label>
              <input className="admin-input" type="text" name="issueNumber" placeholder="Ex : 364" required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Date de parution</label>
              <input className="admin-input" type="text" name="issueDate" placeholder="Ex : Juin · Août 2026 · N°364" />
            </div>
          </div>
        </div>

        {/* Couverture + preview */}
        <div className="admin-form-card">
          <div className="admin-form-card-title">Image de couverture</div>
          <FileZone
            name="cover"
            accept="image/jpeg,image/png,image/webp"
            hint="JPG / PNG · Format portrait recommandé"
            onFilesChange={files => setCoverFile(files[0] || null)}
          />
          <ImagePreview file={coverFile} />
        </div>

        {/* Texte éditorial */}
        <div className="admin-form-card">
          <div className="admin-form-card-title">Texte éditorial (Hero)</div>
          <div className="admin-field">
            <label className="admin-label">Titre principal</label>
            <input className="admin-input" type="text" name="headline" placeholder="Ex : Dakar 2026 — Neels Theric…" />
          </div>
          <div className="admin-field" style={{ marginTop: '1rem' }}>
            <label className="admin-label">Sous-titre mis en valeur</label>
            <input className="admin-input" type="text" name="subheadline" placeholder="Mot(s) mis en rouge dans le titre" />
          </div>
          <div className="admin-field" style={{ marginTop: '1rem' }}>
            <label className="admin-label">Corps de texte</label>
            <textarea className="admin-textarea" name="bodyText" placeholder="Résumé de l'édition visible sur la page d'accueil…" />
          </div>
        </div>

        {/* Sommaire dynamique */}
        <div className="admin-form-card">
          <div className="admin-form-card-title">Sommaire</div>
          <div className="sommaire-editor">
            {sommaire.map((row, i) => (
              <div key={i} className="sommaire-row">
                <input
                  className="admin-input"
                  type="text"
                  placeholder="P."
                  value={row.page}
                  onChange={e => updateRow(i, 'page', e.target.value)}
                />
                <input
                  className="admin-input"
                  type="text"
                  placeholder="Titre de l'article…"
                  value={row.title}
                  onChange={e => updateRow(i, 'title', e.target.value)}
                />
                <button type="button" className="sommaire-remove-btn" onClick={() => removeRow(i)}>×</button>
              </div>
            ))}
            <button type="button" className="sommaire-add-btn" onClick={addRow}>+ Ajouter une ligne</button>
          </div>
        </div>

        {/* Dossiers du Trimestre */}
        <div className="admin-form-card">
          <div className="admin-form-card-title">Dossiers du Trimestre (3 cartes)</div>
          <div className="admin-dossiers-grid">
            {dossiers.map((dos, i) => (
              <div key={i} className="admin-dossier-card" style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 1rem 0' }}>Dossier {i + 1}</h4>
                <div className="admin-field">
                  <label className="admin-label">Tag (ex: Grand Angle)</label>
                  <input className="admin-input" type="text" value={dos.tag} onChange={e => updateDossier(i, 'tag', e.target.value)} required />
                </div>
                <div className="admin-field" style={{ marginTop: '0.5rem' }}>
                  <label className="admin-label">Titre de l'article</label>
                  <input className="admin-input" type="text" value={dos.title} onChange={e => updateDossier(i, 'title', e.target.value)} required />
                </div>
                <div className="admin-field" style={{ marginTop: '1rem' }}>
                  <label className="admin-label">Image illustrative</label>
                  <FileZone
                    name={`dossier_img_${i}`}
                    accept="image/jpeg,image/png,image/webp"
                    hint="Photo du dossier"
                    onFilesChange={files => updateDossier(i, 'file', files[0] || null)}
                  />
                  <ImagePreview file={dos.file} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <StatusMsg status={status} />
        <button type="submit" className="admin-submit-btn" disabled={status?.pending}>
          {status?.pending ? '⏳ Publication en cours…' : '✓ Publier la page d\'accueil'}
        </button>
      </form>
    </div>
  );
}

// ── TAB 2: ARCHIVES ───────────────────────────────────────────────────
function TabArchives() {
  const [status, setStatus]       = useState(null);
  const [recentList, setRecentList] = useState([]);

  // Load recent archives on mount for the audit list
  useEffect(() => {
    fetch('/api/archives')
      .then(r => r.json())
      .then(data => setRecentList(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => {});
  }, [status?.success]);

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ pending: true });
    const formData = new FormData(e.target);
    const result = await uploadArchive(formData);
    setStatus(result);
    if (result?.success) e.target.reset();
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2 className="admin-panel-title">Archives</h2>
        <p className="admin-panel-desc">
          Ajoutez un PDF à la collection. La miniature sera automatiquement extraite de la première page du PDF.
        </p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-card-title">Identification</div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Numéro de l'édition</label>
              <input className="admin-input" type="text" name="issueNumber" placeholder="Ex : 360" required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Année de parution</label>
              <input className="admin-input" type="text" name="year" placeholder="Ex : 2025" defaultValue={new Date().getFullYear()} required />
            </div>
          </div>
        </div>

        <div className="admin-form-card">
          <div className="admin-form-card-title">Fichier PDF</div>
          <FileZone
            name="pdf"
            accept="application/pdf"
            hint="Fichier PDF complet du magazine"
            required
          />
          <p className="admin-hint" style={{ marginTop: '1rem' }}>
            La miniature visible dans la grille d'archives sera automatiquement générée depuis la <strong style={{color:'#666'}}>première page du PDF</strong>. Aucune image séparée n'est nécessaire.
          </p>
        </div>

        <StatusMsg status={status} />
        <button type="submit" className="admin-submit-btn" disabled={status?.pending}>
          {status?.pending ? '⏳ Upload en cours…' : '✓ Archiver ce numéro'}
        </button>
      </form>

      {/* Recent archives audit list */}
      {recentList.length > 0 && (
        <div className="admin-form-card" style={{ marginTop: '2rem' }}>
          <div className="admin-form-card-title">Derniers numéros archivés</div>
          <table className="admin-archive-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Année</th>
                <th>Fichier</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentList.map(a => (
                <tr key={a.id}>
                  <td><span className="admin-badge">{a.id}</span></td>
                  <td>{a.year}</td>
                  <td style={{ fontSize: '0.78rem', color: '#444' }}>{a.pdfUrl.split('/').pop()}</td>
                  <td>
                    <a href={a.pdfUrl} target="_blank" rel="noopener noreferrer" className="admin-table-link">
                      Ouvrir ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── TAB 3: PHOTOTHÈQUE ────────────────────────────────────────────────
function TabPhotos() {
  const [status, setStatus]         = useState(null);
  const [previews, setPreviews]     = useState([]);
  const [photoCount, setPhotoCount] = useState(null);

  useEffect(() => {
    // Approximate count from the photos API endpoint if it exists, fallback gracefully
    fetch('/api/archives').then(() => {}).catch(() => {});
    setPhotoCount(null);
  }, []);

  const handleFilesChange = files => {
    const urls = files.map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
    setPreviews(prev => { prev.forEach(p => URL.revokeObjectURL(p.url)); return urls; });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ pending: true });
    const formData = new FormData(e.target);
    const result = await uploadPhotos(formData);
    setStatus(result);
    if (result?.success) {
      setPreviews(prev => { prev.forEach(p => URL.revokeObjectURL(p.url)); return []; });
      e.target.reset();
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2 className="admin-panel-title">Photothèque</h2>
        <p className="admin-panel-desc">
          Ajoutez des photos à la galerie. Sélectionnez ou glissez plusieurs images en une seule fois.
        </p>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-card">
          <div className="admin-form-card-title">Numéro d'édition (optionnel)</div>
          <div className="admin-field">
            <label className="admin-label">N° du magazine associé</label>
            <input
              className="admin-input"
              type="text"
              name="edition"
              placeholder="Ex : 364 — les photos seront groupées sous ce numéro"
            />
            <p className="admin-hint" style={{ marginTop: '0.5rem' }}>
              Si renseigné, les photos seront prefixées <strong style={{color:'#555'}}>n364-</strong> et apparaissent groupées dans la photothèque. Laissez vide pour une galerie générale.
            </p>
          </div>
        </div>

        <div className="admin-form-card">
          <div className="admin-form-card-title">Sélection des photos</div>
          <FileZone
            name="photos"
            accept="image/jpeg,image/png,image/webp"
            hint="JPG · PNG · WebP — sélection multiple possible"
            multiple
            required
            onFilesChange={handleFilesChange}
          />
          <p className="admin-hint" style={{ marginTop: '1rem' }}>
            Nommez vos fichiers de façon descriptive avant l'upload (ex: <em style={{color:'#555'}}>trail-aix-2026.jpg</em>). Ils seront stockés dans <strong style={{color:'#555'}}>/media/photos/</strong> et visibles immédiatement.
          </p>
        </div>

        {/* Mini photo preview grid */}
        {previews.length > 0 && (
          <div className="admin-form-card">
            <div className="admin-form-card-title">Aperçu — {previews.length} photo(s)</div>
            <div className="admin-photo-grid">
              {previews.map((p, i) => (
                <div key={i} className="admin-photo-thumb" title={p.name}>
                  <img src={p.url} alt={p.name} />
                </div>
              ))}
            </div>
          </div>
        )}

        <StatusMsg status={status} />
        <button type="submit" className="admin-submit-btn" disabled={status?.pending}>
          {status?.pending ? '⏳ Upload en cours…' : `✓ Ajouter ${previews.length > 0 ? previews.length + ' ' : ''}photo(s)`}
        </button>
      </form>
    </div>
  );
}

// ── TABS CONFIG ───────────────────────────────────────────────────────
const TABS = [
  { id: 'home',    label: "Page d'accueil", component: TabHomePage },
  { id: 'archive', label: 'Archives',        component: TabArchives },
  { id: 'photos',  label: 'Photothèque',     component: TabPhotos },
];

// ── MAIN EXPORT ───────────────────────────────────────────────────────
export default function AdminForms({ userName, logoutAction }) {
  const [activeTab, setActiveTab] = useState('home');
  const Active = TABS.find(t => t.id === activeTab).component;

  return (
    <div className="admin-dashboard">
      {/* Topbar */}
      <div className="admin-topbar">
        <div className="admin-brand">
          <div className="admin-brand-dot" />
          <span className="admin-brand-name">Sport <span>Santé</span> · Admin</span>
        </div>
        <div className="admin-user-info">
          {userName && <span className="admin-welcome">Bonjour, {userName}</span>}
          <form action={logoutAction}>
            <button type="submit" className="admin-logout-btn">Déconnexion</button>
          </form>
        </div>
      </div>

      {/* Tab nav */}
      <nav className="admin-tab-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Panel */}
      <div className="admin-content">
        <Active />
      </div>
    </div>
  );
}
