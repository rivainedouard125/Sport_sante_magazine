import { auth, signOut } from "@/auth";
import { put } from '@vercel/blob';

export const metadata = { title: 'Administration | Sport Santé' };

export default async function AdminPage() {
  const session = await auth();

  // Basic server action template for uploading a file to Vercel Blob
  async function uploadFile(formData) {
    'use server';
    const file = formData.get('file');
    // In actual implementation, Vercel Blob requires BLOB_READ_WRITE_TOKEN from env
    if (file && file.size > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
      // const blob = await put(file.name, file, { access: 'public' });
      // console.log("Uploaded blob:", blob.url);
      // DB Save logic goes here...
    }
  }

  return (
    <main className="container" style={{ padding: '4rem 1rem', minHeight: '60vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="title" style={{ fontSize: '2.5rem' }}>Espace Administrateur</h1>
        <form action={async () => {
          'use server';
          await signOut();
        }}>
          <button type="submit" className="btn-primary" style={{ backgroundColor: 'var(--border-color)' }}>Déconnexion</button>
        </form>
      </div>
      
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
        Bienvenue {session?.user?.name}. Utilisez cet espace pour mettre à jour le contenu du site.
      </p>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        {/* Upload form for new magazine */}
        <div style={{ padding: '2rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Publier un nouveau numéro</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} action={uploadFile}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Numéro de l'édition</label>
              <input type="text" name="issueNumber" placeholder="Ex: 364" required style={{ padding: '0.5rem', background: 'var(--bg-darker)', color: 'white', border: '1px solid var(--border-color)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Fichier PDF du magazine</label>
              <input type="file" name="file" accept="application/pdf" style={{ color: 'var(--text-muted)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Image de couverture (Optionnel)</label>
              <input type="file" name="cover" accept="image/jpeg, image/png" style={{ color: 'var(--text-muted)' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Mettre en ligne</button>
          </form>
        </div>

      </div>
    </main>
  );
}
