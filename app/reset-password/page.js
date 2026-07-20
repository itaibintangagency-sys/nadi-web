'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="reset-page">
      <div className="card">
        <p className="eyebrow">Nadi</p>
        <h1>Reset Password</h1>
        <p className="sub">Masukkan password baru untuk akun kamu.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Password baru (min. 8 karakter)"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary submit-btn">
            {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </form>
      </div>

      <style>{`
        .reset-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--navy);
          padding: 24px;
        }
        .card {
          background: var(--white);
          border-radius: 16px;
          padding: 40px 32px;
          width: 100%;
          max-width: 360px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 8px;
        }
        .card h1 { font-size: 22px; margin: 0 0 6px; color: var(--navy); }
        .sub { font-size: 14px; color: var(--brown); margin: 0 0 24px; }
        form { display: flex; flex-direction: column; gap: 12px; }
        .submit-btn { width: 100%; text-align: center; }
        .error-text { color: #b3261e; font-size: 13px; margin: 0; }
      `}</style>
    </div>
  );
}
