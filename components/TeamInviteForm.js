'use client';

import { useState } from 'react';

export default function TeamInviteForm({ brands = [], onInvited }) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('client');
  const [brandIds, setBrandIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role,
          full_name: fullName || undefined,
          brand_ids: brandIds,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error ?? 'Gagal mengundang' });
        return;
      }

      setMessage({ type: 'success', text: `Undangan terkirim ke ${email}` });
      setEmail('');
      setFullName('');
      setBrandIds([]);
      onInvited?.(data.user);
    } catch (err) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan' });
    } finally {
      setLoading(false);
    }
  }

  function toggleBrand(id) {
    setBrandIds((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]));
  }

  return (
    <form onSubmit={handleSubmit} className="team-invite-form">
      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@perusahaan.com"
          className="input-field"
        />
      </div>

      <div className="field">
        <label htmlFor="full_name">Nama (opsional)</label>
        <input
          id="full_name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="field">
        <label>Role</label>
        <div className="role-toggle">
          <button
            type="button"
            className={role === 'admin' ? 'active' : ''}
            onClick={() => setRole('admin')}
          >
            Admin
          </button>
          <button
            type="button"
            className={role === 'client' ? 'active' : ''}
            onClick={() => setRole('client')}
          >
            Client
          </button>
        </div>
      </div>

      <div className="field">
        <label>Brand yang diakses {role === 'client' ? '(wajib minimal 1)' : '(opsional)'}</label>
        <div className="brand-checklist">
          {brands.map((b) => (
            <label key={b.id} className="brand-item">
              <input
                type="checkbox"
                checked={brandIds.includes(b.id)}
                onChange={() => toggleBrand(b.id)}
              />
              {b.name}
            </label>
          ))}
          {brands.length === 0 && <p className="empty-hint">Belum ada brand terdaftar.</p>}
        </div>
      </div>

      {message && <p className={`form-message ${message.type}`}>{message.text}</p>}

      <button type="submit" disabled={loading} className="btn-primary submit-btn">
        {loading ? 'Mengirim undangan...' : 'Kirim Undangan'}
      </button>

      <style jsx>{`
        .team-invite-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 420px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        label {
          font-size: 13px;
          font-weight: 600;
          color: var(--brown);
        }
        .role-toggle {
          display: flex;
          gap: 8px;
        }
        .role-toggle button {
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid var(--navy);
          background: var(--white);
          color: var(--navy);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .role-toggle button.active {
          background: var(--navy);
          color: var(--white);
        }
        .brand-checklist {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 160px;
          overflow-y: auto;
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 10px 12px;
        }
        .brand-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 400;
          color: var(--ink);
        }
        .empty-hint {
          font-size: 12px;
          color: var(--brown);
          margin: 0;
        }
        .form-message {
          font-size: 13px;
          margin: 0;
        }
        .form-message.error {
          color: #b3261e;
        }
        .form-message.success {
          color: var(--navy);
        }
        .submit-btn {
          width: fit-content;
        }
      `}</style>
    </form>
  );
}
