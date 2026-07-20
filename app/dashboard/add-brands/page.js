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
  const [mode, setMode] = useState('subscription'); // 'subscription' | 'fixed'
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
      <p className="eyebrow">Super Admin</p>
      <h1>Tambah Brand</h1>
      <p className="sub">
        <Link href="/dashboard/brands">← Kembali ke daftar Brands</Link>
      </p>

      <form onSubmit={handleSubmit} className="form">
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
          <label>Kontak Client (opsional)</label>
          <input
            type="text"
            value={clientContact}
            onChange={(e) => setClientContact(e.target.value)}
            className="input-field"
            placeholder="email atau nomor WhatsApp"
          />
        </div>

        <div className="field">
          <label>Platform *</label>
          <div className="platform-toggle">
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
          <div className="mode-toggle">
            <button type="button" className={mode === 'subscription' ? 'active' : ''} onClick={() => setMode('subscription')}>
              Langganan (berkelanjutan)
            </button>
            <button type="button" className={mode === 'fixed' ? 'active' : ''} onClick={() => setMode('fixed')}>
              Durasi Tetap
            </button>
          </div>
        </div>

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

        <div className="field">
          <label>Keyword Awal (opsional)</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="input-field"
            placeholder="Kosongkan untuk generate otomatis"
          />
          <p className="hint">Kalau kosong, sistem akan generate keyword otomatis — perlu di-approve via Telegram sebelum scan mulai.</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading || platforms.length === 0} className="btn-primary submit-btn">
          {loading ? 'Menyimpan...' : 'Tambah Brand'}
        </button>
      </form>

      <style>{`
        .add-brand-page { padding: 32px; max-width: 520px; }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 8px;
        }
        h1 { font-size: 24px; margin: 0 0 8px; color: var(--navy); }
        .sub { margin: 0 0 28px; font-size: 13px; }
        .sub a { color: var(--brown); }

        .form { display: flex; flex-direction: column; gap: 18px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        label { font-size: 13px; font-weight: 600; color: var(--brown); }
        .hint { font-size: 12px; color: var(--brown); margin: 2px 0 0; }

        .platform-toggle, .mode-toggle { display: flex; gap: 8px; flex-wrap: wrap; }
        .platform-toggle button, .mode-toggle button {
          padding: 8px 16px;
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
        .platform-toggle button.active, .mode-toggle button.active {
          background: var(--navy);
          color: var(--white);
        }

        .error-text { color: #b3261e; font-size: 13px; margin: 0; }
        .submit-btn { width: fit-content; }
      `}</style>
    </div>
  );
}
