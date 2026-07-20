'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function SetPasswordPage() {
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
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Selamat datang di BIS</h1>
      <p style={{ fontSize: 14, color: '#57534e', marginBottom: 24 }}>
        Buat password untuk akun kamu.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="password"
          placeholder="Password baru (min. 8 karakter)"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, border: '1px solid #e7e5e0', borderRadius: 8 }}
        />
        {error && <p style={{ color: '#993C1D', fontSize: 13 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 10,
            borderRadius: 8,
            border: 'none',
            background: '#0F6E5C',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {loading ? 'Menyimpan...' : 'Simpan & Masuk'}
        </button>
      </form>
    </div>
  );
}
