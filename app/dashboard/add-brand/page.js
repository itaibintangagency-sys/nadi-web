'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PLATFORM_OPTIONS = ['tiktok', 'instagram', 'youtube'];

export default function AddBrandPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [mode, setMode] = useState('subscription');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function togglePlatform(p) {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        client_name: clientName,
        client_contact: clientContact || undefined,
        platforms,
        mode,
        start_date: startDate,
        end_date: mode === 'fixed' ? endDate : undefined,
        keyword: keyword || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? 'Gagal menambah brand');
      return;
    }

    router.push('/dashboard/brands');
    router.refresh();
  }

  return (
    <div className="add-brand-page">
      <div className="page-header">
        <p className="eyebrow">Super Admin</p>
        <h1>Tambah Brand</h1>
        <Link href="/dashboard/brands" className="back-link">
          ← Kembali ke daftar Brands
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {/* SECTION 1: Info Brand */}
        <div className="form-section">
          <h2>Informasi Brand</h2>
          <div className="field">
            <label>Nama Brand *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Scarlett Skincare"
            />
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
                placeholder="PT Scarlett Indonesia"
              />
            </div>
            <div className="field">
              <label>Kontak Client</label>
              <input
                type="text"
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                className="input-field"
                placeholder="email / WhatsApp"
              />
            </div>
          </div>
        </div>

        <div className="divider" />

        {/* SECTION 2: Cakupan Monitoring */}
        <div className="form-section">
          <h2>Cakupan Monitoring</h2>
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
            <label>Model Monitoring *</label>
            <div className="toggle-group">
              <button type="button" className={mode === 'subscription' ? 'active' : ''} onClick={() => setMode('subscription')}>
                Langganan (Berkelanjutan)
              </button>
              <button type="button" className={mode === 'fixed' ? 'active' : ''} onClick={() => setMode('fixed')}>
                Durasi Tetap
              </button>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            {mode === 'fixed' && (
              <div className="field">
                <label>Tanggal Selesai *</label>
                <input
                  type="date"
                  required={mode === 'fixed'}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
                />
              </div>
            )}
          </div>
        </div>

        <div className="divider" />

        {/* SECTION 3: Keyword */}
        <div className="form-section">
          <h2>Keyword Pemantauan</h2>
          <div className="field">
            <label>Keyword Awal (opsional)</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="input-field"
              placeholder="Kosongkan untuk generate otomatis"
            />
            <p className="hint">
              Kalau kosong, sistem akan generate keyword otomatis — perlu di-approve via Telegram
              sebelum scan mulai.
            </p>
          </div>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading || platforms.length === 0} className="btn-primary submit-btn">
          {loading ? 'Menyimpan...' : 'Tambah Brand'}
        </button>
      </form>

      <style>{`
        .add-brand-page {
          padding: 40px 32px;
          max-width: 640px;
          margin: 0 auto;
        }
        .page-header { margin-bottom: 24px; }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 8px;
        }
        h1 { font-size: 26px; margin: 0 0 10px; color: var(--navy); }
        .back-link { font-size: 13px; color: var(--brown); text-decoration: none; }
        .back-link:hover { color: var(--navy); }

        .form-card {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 12px 30px rgba(51,86,170,0.06);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-section { display: flex; flex-direction: column; gap: 16px; }
        .form-section h2 {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--navy);
          margin: 0;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
        }

        .divider { height: 1px; background: var(--line); }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 480px) {
          .field-row { grid-template-columns: 1fr; }
        }
        label { font-size: 13px; font-weight: 600; color: var(--brown); }
        .hint { font-size: 12px; color: var(--brown); margin: 2px 0 0; line-height: 1.5; }

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
          transition: background 0.2s ease, color 0.2s ease;
        }
        .toggle-group button.active {
          background: var(--navy);
          color: var(--white);
        }

        .error-text {
          color: #b3261e;
          font-size: 13px;
          margin: 0;
          background: #FBEAEA;
          padding: 10px 14px;
          border-radius: 8px;
        }
        .submit-btn { align-self: flex-start; }
      `}</style>
    </div>
  );
}
