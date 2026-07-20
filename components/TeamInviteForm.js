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
        />
      </div>

      <div className="field">
        <label htmlFor="full_name">Nama (opsional)</label>
        <input
          id="full_name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
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

      <button type="submit" disabled={loading} className="submit-btn">
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
          color: var(--ink-soft, #57534e);
        }
        input[type='email'],
        input[type='text'] {
          padding: 10px 12px;
          border: 1px solid var(--line, #e7e5e0);
          border-radius: 10px;
          font-size: 14px;
        }
        .role-toggle {
          display: flex;
          gap: 8px;
        }
        .role-toggle button {
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid var(--role-bd, #b4530a);
          background: var(--role-bg, #fff4e5);
          color: var(--role-tx, #7a3806);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }
        .role-toggle button.active {
          background: var(--role-bd, #b4530a);
          color: #fff;
        }
        .brand-checklist {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 160px;
          overflow-y: auto;
          border: 1px solid var(--line-soft, #eeece8);
          border-radius: 10px;
          padding: 10px 12px;
        }
        .brand-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 400;
          color: var(--ink, #1a1a1a);
        }
        .empty-hint {
          font-size: 12px;
          color: var(--ink-faint, #8a8a85);
          margin: 0;
        }
        .form-message {
          font-size: 13px;
          margin: 0;
        }
        .form-message.error {
          color: var(--error-tx, #712b13);
        }
        .form-message.success {
          color: var(--campaign-tx, #085041);
        }
        .submit-btn {
          padding: 10px 16px;
          border-radius: 10px;
          border: none;
          background: var(--accent, #0f6e5c);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}
