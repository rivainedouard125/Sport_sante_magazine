'use client';

import { useState, useEffect } from 'react';
import { 
  saveIssueIdentity, 
  saveIssueCover, 
  saveIssueEditorial, 
  saveIssueSommaire, 
  saveIssueDossiers, 
  uploadArchive, 
  uploadPhotos 
} from './actions';
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

// ── TAB 1: PAGE D'ACCUEIL (REDESIGNED) ─────────────────────────────
function TabHomePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  // Section-specific status
  const [status, setStatus] = useState({
    identity: null,
    cover: null,
    editorial: null,
    sommaire: null,
    dossiers: null
  });

  const [sommaire, setSommaire] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [coverFile, setCoverFile] = useState(null);

  // Fetch current live data on mount
  useEffect(() => {
    fetch('/api/admin/current-issue')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setSommaire(json.sommaire && json.sommaire.length > 0 ? json.sommaire : [{ page: '', text: '' }]);
        
        // Ensure we always have 3 dossiers to edit
        if (json.dossiers && json.dossiers.length === 3) {
          setDossiers(json.dossiers);
        } else {
          setDossiers([
            { tag: 'Grand Angle', title: '', imageSrc: '' },
            { tag: 'Reportage', title: '', imageSrc: '' },
            { tag: 'Elite', title: '', imageSrc: '' }
          ]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const addRow = () => setSommaire(s => [...s, { page: '', text: '' }]);
  const removeRow = i => setSommaire(s => s.filter((_, idx) => idx !== i));
  const updateRow = (i, field, val) =>
    setSommaire(s => s.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  const updateDossier = (i, field, val) =>
    setDossiers(d => d.map((dos, idx) => idx === i ? { ...dos, [field]: val } : dos));

  const handleSaveSection = async (section, action, e) => {
    e.preventDefault();
    setStatus(s => ({ ...s, [section]: { pending: true } }));
    
    const formData = new FormData(e.target);
    formData.set('issueNumber', data.issueNumber);
    
    if (section === 'sommaire') {
      formData.set('sommaire', JSON.stringify(sommaire));
    }
    if (section === 'dossiers') {
      formData.set('dossiersData', JSON.stringify(dossiers.map(d => ({ tag: d.tag, title: d.title }))));
    }

    const result = await action(formData);
    setStatus(s => ({ ...s, [section]: result }));
  };

  if (loading) return <div className="admin-loading">Chargement des données en direct...</div>;
  if (!data) return <div className="admin-error">Erreur: Impossible de charger les données.</div>;

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2 className="admin-panel-title">Éditeur de Page d'Accueil</h2>
        <p className="admin-panel-desc">
          Les données actuelles du <strong>N°{data.issueNumber}</strong> ont été chargées. Chaque section se sauvegarde indépendamment.
        </p>
      </div>

      <div className="admin-sections-grid">
        
        {/* 1. IDENTITY SECTION */}
        <section className="admin-form-card">
          <div className="admin-form-card-title">1. Identité du numéro</div>
          <form onSubmit={e => handleSaveSection('identity', saveIssueIdentity, e)}>
            <div className="admin-form-row">
              <div className="admin-field">
                <label className="admin-label">Numéro</label>
                <input className="admin-input" type="text" name="issueNumber" defaultValue={data.issueNumber} required />
              </div>
              <div className="admin-field">
                <label className="admin-label">Date de parution</label>
                <input className="admin-input" type="text" name="issueDate" defaultValue={data.issueDate} />
              </div>
            </div>
            <div className="admin-card-footer">
              <StatusMsg status={status.identity} />
              <button type="submit" className="admin-save-btn" disabled={status.identity?.pending}>
                {status.identity?.pending ? '⏳...' : 'Sauvegarder Identité'}
              </button>
            </div>
          </form>
        </section>

        {/* 2. COVER SECTION */}
        <section className="admin-form-card">
          <div className="admin-form-card-title">2. Image de couverture</div>
          <div className="admin-current-preview">
            <span className="admin-label-small">Actuelle :</span>
            <img src={data.coverSrc} alt="Current" className="admin-thumb-tiny" />
          </div>
          <form onSubmit={e => handleSaveSection('cover', saveIssueCover, e)}>
            <FileZone
              name="cover"
              accept="image/jpeg,image/png,image/webp"
              hint="Changer l'image"
              onFilesChange={files => setCoverFile(files[0] || null)}
            />
            <ImagePreview file={coverFile} />
            <div className="admin-card-footer">
              <StatusMsg status={status.cover} />
              <button type="submit" className="admin-save-btn" disabled={status.cover?.pending}>
                {status.cover?.pending ? '⏳...' : 'Sauvegarder Image'}
              </button>
            </div>
          </form>
        </section>

        {/* 3. EDITORIAL SECTION */}
        <section className="admin-form-card">
          <div className="admin-form-card-title">3. Texte éditorial (Hero)</div>
          <form onSubmit={e => handleSaveSection('editorial', saveIssueEditorial, e)}>
            <div className="admin-field">
              <label className="admin-label">Titre principal</label>
              <input className="admin-input" type="text" name="headline" defaultValue={data.headline} />
            </div>
            <div className="admin-field" style={{ marginTop: '1rem' }}>
              <label className="admin-label">Sous-titre (mot en rouge)</label>
              <input className="admin-input" type="text" name="subheadline" defaultValue={data.subheadline} />
            </div>
            <div className="admin-field" style={{ marginTop: '1rem' }}>
              <label className="admin-label">Corps de texte</label>
              <textarea className="admin-textarea" name="bodyText" defaultValue={data.bodyText} />
            </div>
            <div className="admin-card-footer">
              <StatusMsg status={status.editorial} />
              <button type="submit" className="admin-save-btn" disabled={status.editorial?.pending}>
                {status.editorial?.pending ? '⏳...' : 'Sauvegarder Editorial'}
              </button>
            </div>
          </form>
        </section>

        {/* 4. SOMMAIRE SECTION */}
        <section className="admin-form-card">
          <div className="admin-form-card-title">4. Sommaire interactif</div>
          <form onSubmit={e => handleSaveSection('sommaire', saveIssueSommaire, e)}>
            <div className="sommaire-editor">
              {sommaire.map((row, i) => (
                <div key={i} className="sommaire-row">
                  <input className="admin-input" type="text" placeholder="P." value={row.page} onChange={e => updateRow(i, 'page', e.target.value)} />
                  <input className="admin-input" type="text" placeholder="Titre..." value={row.text} onChange={e => updateRow(i, 'text', e.target.value)} />
                  <button type="button" className="sommaire-remove-btn" onClick={() => removeRow(i)}>×</button>
                </div>
              ))}
              <button type="button" className="sommaire-add-btn" onClick={addRow}>+ Ajouter une ligne</button>
            </div>
            <div className="admin-card-footer">
              <StatusMsg status={status.sommaire} />
              <button type="submit" className="admin-save-btn" disabled={status.sommaire?.pending}>
                {status.sommaire?.pending ? '⏳...' : 'Sauvegarder Sommaire'}
              </button>
            </div>
          </form>
        </section>

        {/* 5. DOSSIERS SECTION */}
        <section className="admin-form-card">
          <div className="admin-form-card-title">5. Dossiers du Trimestre</div>
          <form onSubmit={e => handleSaveSection('dossiers', saveIssueDossiers, e)}>
            <div className="admin-dossiers-grid">
              {dossiers.map((dos, i) => (
                <div key={i} className="admin-dossier-card-v2">
                  <div className="admin-dossier-header">
                    <span className="admin-badge-small">Dossier {i + 1}</span>
                    {dos.imageSrc && <img src={dos.imageSrc} alt="Dos" className="admin-thumb-micro" />}
                  </div>
                  <input className="admin-input-small" type="text" value={dos.tag} onChange={e => updateDossier(i, 'tag', e.target.value)} placeholder="Tag" required />
                  <input className="admin-input-small" type="text" value={dos.title} onChange={e => updateDossier(i, 'title', e.target.value)} placeholder="Titre" required />
                  <FileZone
                    name={`dossier_img_${i}`}
                    accept="image/jpeg,image/png,image/webp"
                    hint="Changer l'image"
                    onFilesChange={files => updateDossier(i, 'file', files[0] || null)}
                  />
                </div>
              ))}
            </div>
            <div className="admin-card-footer">
              <StatusMsg status={status.dossiers} />
              <button type="submit" className="admin-save-btn" disabled={status.dossiers?.pending}>
                {status.dossiers?.pending ? '⏳...' : 'Sauvegarder Dossiers'}
              </button>
            </div>
          </form>
        </section>

      </div>
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
          <a href="/" className="admin-back-btn">← Voir le site</a>
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
