'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    // Selalu tampilkan pesan sukses generik, tidak bocorkan apakah email terdaftar atau tidak.
    setSent(true);
  }

  return (
    <div className="forgot-page">
      <div className="card">
        <p className="eyebrow">Nadi</p>
        <h1>Lupa Password</h1>

        {sent ? (
          <p className="success-text">
            Kalau email <strong>{email}</strong> terdaftar, link reset password sudah dikirim. Cek
            inbox (atau folder spam) kamu.
          </p>
        ) : (
          <>
            <p className="sub">Masukkan email akun kamu, kami kirimkan link untuk reset password.</p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
              {error && <p className="error-text">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary submit-btn">
                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
              </button>
            </form>
          </>
        )}

        <p className="hint">
          <Link href="/login">← Kembali ke halaman Masuk</Link>
        </p>
      </div>

      <style>{`
        .forgot-page {
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
          max-width: 380px;
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
        .success-text { font-size: 14px; color: var(--ink); line-height: 1.6; margin: 0 0 8px; }
        .hint { font-size: 12px; margin-top: 20px; text-align: center; }
        .hint a { color: var(--brown); }
      `}</style>
    </div>
  );
}
