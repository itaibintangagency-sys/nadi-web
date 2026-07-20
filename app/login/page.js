'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="eyebrow">Nadi</p>
        <h1>Masuk</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary submit-btn">
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        <p className="hint">Belum punya akun? Hubungi Super Admin untuk diundang.</p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--navy);
          padding: 24px;
        }
        .login-card {
          background: var(--white);
          border-radius: 16px;
          padding: 40px 32px;
          width: 100%;
          max-width: 360px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }
        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          font-weight: 700;
          margin: 0 0 8px;
        }
        .login-card h1 {
          font-size: 22px;
          margin: 0 0 24px;
          color: var(--navy);
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .submit-btn {
          width: 100%;
          text-align: center;
        }
        .error-text {
          color: #b3261e;
          font-size: 13px;
          margin: 0;
        }
        .hint {
          font-size: 12px;
          color: var(--brown);
          margin-top: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
