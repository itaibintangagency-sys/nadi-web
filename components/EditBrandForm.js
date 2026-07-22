'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

const PLATFORM_OPTIONS = ['tiktok', 'instagram', 'youtube'];
const STATUS_OPTIONS = [
  { value: 'active', label: 'Aktif' },
  { value: 'paused', label: 'Dijeda' },
  { value: 'completed', label: 'Selesai' },
  { value: 'expired', label: 'Kedaluwarsa' },
];

export default function EditBrandForm({ brand }) {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState(brand.name || '');
  const [clientName, setClientName] = useState(brand.client_name || '');
  const [clientContact, setClientContact] = useState(brand.client_contact || '');
  const [platforms, setPlatforms] = useState(brand.platforms || []);
  const [competitorsText, setCompetitorsText] = useState((brand.competitors || []).join(', '));
  const [status, setStatus] = useState(brand.status || 'active');
  const [logoUrl, setLogoUrl] = useState(brand.logo_url || '');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState(null);

  function togglePlatform(p) {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  async function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('File logo harus berupa gambar');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran logo maksimal 2MB');
      return;
    }

    setUploadingLogo(true);
    setError(null);

    const ext = file.name.split('.').pop();
    const path = `${brand.id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('brand-logos').upload(path, file, {
      upsert: true,
    });

    if (uploadError) {
      setError(`Gagal upload logo: ${uploadError.message}`);
      setUploadingLogo(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('brand-logos').getPublicUrl(path);
    setLogoUrl(publicUrlData.publicUrl);
    setUploadingLogo(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/brands/${brand.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        client_name: clientName,
        client_contact: clientContact || null,
        platforms,
        competitors: competitorsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        status,
        logo_url: logoUrl || null,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? 'Gagal menyimpan perubahan');
      return;
    }

    router.push(`/dashboard/brands/${brand.id}`);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setDeleting(true);
    const res = await fetch(`/api/brands/${brand.id}`, { method: 'DELETE' });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? 'Gagal menghapus brand');
      return;
    }

    router.push('/dashboard/brands');
    router.refresh();
  }

  return (
    <div className="form-wrap">
      <form onSubmit={handleSubmit} className="form-card">
        <div className="field">
          <label>Logo Brand</label>
          <div className="logo-row">
            <div className="logo-preview">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="Logo" />
              ) : (
                <span className="logo-placeholder">{name.charAt(0).toUpperCase() || '?'}</span>
              )}
            </div>
            <div className="logo-upload-controls">
              <label className="upload-btn">
                {uploadingLogo ? 'Mengunggah...' : 'Pilih Gambar'}
                <input type="file" accept="image/*" onChange={handleLogoChange} disabled={uploadingLogo} hidden />
              </label>
              {logoUrl && (
                <button type="button" className="remove-logo-btn" onClick={() => setLogoUrl('')}>
                  Hapus Logo
                </button>
              )}
              <p className="logo-hint">PNG/JPG, maks 2MB</p>
            </div>
          </div>
        </div>

        <div className="field">
          <label>Nama Brand *</label>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Nama Client *</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="field">
            <label>Kontak Client</label>
            <input
              type="text"
              value={clientContact}
              onChange={(e) => setClientContact(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="field">
          <label>Platform *</label>
          <div className="toggle-group">
            {PLATFORM_OPTIONS.map((p) => (
              <button
                type="button"
                key={p}
                className={platforms.includes(p) ? 'active' : ''}
                onClick={() => togglePlatform(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Kompetitor (pisahkan dengan koma)</label>
          <input
            type="text"
            value={competitorsText}
            onChange={(e) => setCompetitorsText(e.target.value)}
            className="input-field"
            placeholder="Brand A, Brand B, Brand C"
          />
        </div>

        <div className="field">
          <label>Status</label>
          <div className="toggle-group">
            {STATUS_OPTIONS.map((s) => (
              <button type="button" key={s.value} className={status === s.value ? 'active' : ''} onClick={() => setStatus(s.value)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading || platforms.length === 0 || uploadingLogo} className="btn-primary submit-btn">
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>

      <div className="danger-zone">
        <h3>Zona Berbahaya</h3>
        <p>Menghapus brand akan menghapus semua data terkait secara permanen. Tindakan ini tidak bisa dibatalkan.</p>
        <button onClick={handleDelete} disabled={deleting} className="delete-btn">
          {deleting ? 'Menghapus...' : confirmDelete ? 'Klik sekali lagi untuk konfirmasi' : `Hapus Brand "${brand.name}"`}
        </button>
      </div>

      <style jsx>{`
        .form-wrap { display: flex; flex-direction: column; gap: 24px; }
        .form-card {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 480px) { .field-row { grid-template-columns: 1fr; } }
        label { font-size: 13px; font-weight: 600; color: var(--brown); }

        .logo-row { display: flex; align-items: center; gap: 16px; }
        .logo-preview {
          width: 64px;
          height: 64px;
          border-radius: 14px;
          overflow: hidden;
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid var(--line);
        }
        .logo-preview img { width: 100%; height: 100%; object-fit: cover; }
        .logo-placeholder { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; color: var(--navy); }
        .logo-upload-controls { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
        .upload-btn {
          font-size: 13px;
          font-weight: 600;
          color: var(--navy);
          border: 1px solid var(--navy);
          padding: 7px 16px;
          border-radius: 8px;
          cursor: pointer;
        }
        .upload-btn:hover { background: var(--cream); }
        .remove-logo-btn {
          background: transparent;
          border: none;
          color: #b3261e;
          font-size: 12px;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }
        .logo-hint { font-size: 11px; color: var(--brown); margin: 0; }

        .toggle-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .toggle-group button {
          padding: 9px 18px;
          border-radius: 999px;
          border: 1px solid var(--navy);
          background: var(--white);
          color: var(--navy);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-transform: capitalize;
        }
        .toggle-group button.active { background: var(--navy); color: var(--white); }

        .error-text { color: #b3261e; font-size: 13px; margin: 0; background: #FBEAEA; padding: 10px 14px; border-radius: 8px; }
        .submit-btn { align-self: flex-start; }

        .danger-zone {
          border: 1px solid #F0C4C4;
          background: #FFF8F8;
          border-radius: 16px;
          padding: 20px 24px;
        }
        .danger-zone h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #B3261E; margin: 0 0 8px; }
        .danger-zone p { font-size: 13px; color: var(--brown); margin: 0 0 14px; line-height: 1.6; }
        .delete-btn {
          padding: 9px 18px;
          border-radius: 8px;
          border: 1px solid #B3261E;
          background: var(--white);
          color: #B3261E;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }
        .delete-btn:hover { background: #B3261E; color: var(--white); }
      `}</style>
    </div>
  );
}
