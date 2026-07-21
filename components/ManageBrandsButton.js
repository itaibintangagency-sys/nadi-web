'use client';

import { useEffect, useState } from 'react';

export default function ManageBrandsButton({ userId, userName, brands }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setMessage(null);
    fetch(`/api/team/${userId}/brands`)
      .then((r) => r.json())
      .then((data) => setSelected(data.brand_ids ?? []))
      .finally(() => setLoading(false));
  }, [open, userId]);

  function toggle(brandId) {
    setSelected((prev) => (prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/team/${userId}/brands`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand_ids: selected }),
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setMessage({ type: 'error', text: data.error ?? 'Gagal menyimpan' });
      return;
    }
    setMessage({ type: 'success', text: 'Tersimpan' });
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="manage-btn">
        Kelola Brand
      </button>

      {open && (
        <>
          <div className="backdrop" onClick={() => setOpen(false)} />
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Brand Assignment</p>
                <p className="panel-name">{userName || 'Anggota'}</p>
              </div>
              <button onClick={() => setOpen(false)} className="close-btn" aria-label="Tutup">
                ×
              </button>
            </div>

            {loading ? (
              <p className="loading-text">Memuat...</p>
            ) : brands.length === 0 ? (
              <p className="empty-text">Belum ada brand terdaftar.</p>
            ) : (
              <div className="brand-checklist">
                {brands.map((b) => (
                  <label key={b.id} className="brand-item">
                    <input type="checkbox" checked={selected.includes(b.id)} onChange={() => toggle(b.id)} />
                    {b.name}
                  </label>
                ))}
              </div>
            )}

            {message && <p className={`msg ${message.type}`}>{message.text}</p>}

            <button onClick={handleSave} disabled={saving || loading} className="btn-primary save-btn">
              {saving ? 'Menyimpan...' : 'Simpan Assignment'}
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        .manage-btn {
          font-size: 12px;
          font-weight: 600;
          color: var(--navy);
          background: var(--white);
          border: 1px solid var(--line);
          padding: 5px 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        .manage-btn:hover { border-color: var(--navy); background: var(--cream); }

        .backdrop {
          position: fixed;
          inset: 0;
          background: transparent;
          z-index: 40;
        }
        .panel {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 340px;
          max-width: 90vw;
          background: var(--white);
          border-left: 1px solid var(--line);
          box-shadow: -12px 0 32px rgba(42, 38, 32, 0.12);
          z-index: 50;
          padding: 24px;
          overflow-y: auto;
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .panel-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 4px;
        }
        .panel-name { font-size: 16px; font-weight: 700; color: var(--navy); margin: 0; }
        .close-btn {
          background: transparent; border: none; font-size: 22px; line-height: 1;
          color: var(--brown); cursor: pointer; padding: 0;
        }
        .close-btn:hover { color: var(--navy); }

        .loading-text, .empty-text { font-size: 13px; color: var(--brown); }

        .brand-checklist {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 12px 14px;
          max-height: 320px;
          overflow-y: auto;
        }
        .brand-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--ink); }

        .msg { font-size: 13px; margin: 0; }
        .msg.error { color: #b3261e; }
        .msg.success { color: var(--navy); }

        .save-btn { width: 100%; text-align: center; }
      `}</style>
    </>
  );
}
