'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

const ROLE_LABEL = { super_admin: 'Super Admin', admin: 'Admin', client: 'Client' };

export default function ProfilePage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [savingName, setSavingName] = useState(false);
  const [nameMessage, setNameMessage] = useState(null);

  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setEmail(user.email);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

      setRole(profile?.role ?? '');
      setFullName(profile?.full_name ?? '');
      setLoadingProfile(false);
    }
    load();
  }, []);

  async function handleSaveName(e) {
    e.preventDefault();
    setSavingName(true);
    setNameMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id);

    setSavingName(false);
    setNameMessage(error ? { type: 'error', text: error.message } : { type: 'success', text: 'Nama berhasil disimpan' });
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setSavingPassword(false);
    if (error) {
      setPasswordMessage({ type: 'error', text: error.message });
    } else {
      setPasswordMessage({ type: 'success', text: 'Password berhasil diganti' });
      setNewPassword('');
    }
  }

  if (loadingProfile) {
    return <div className="profile-page">Memuat...</div>;
  }

  return (
    <div className="profile-page">
      <p className="eyebrow">Akun</p>
      <h1>Profil Saya</h1>

      <div className="card">
        <h2>Informasi Akun</h2>
        <div className="readonly-row">
          <span className="label">Email</span>
          <span className="value">{email}</span>
        </div>
        <div className="readonly-row">
          <span className="label">Role</span>
          <span className="value">{ROLE_LABEL[role] ?? role}</span>
        </div>
      </div>

      <form className="card" onSubmit={handleSaveName}>
        <h2>Ganti Nama</h2>
        <div className="field">
          <label>Nama Lengkap</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-field"
            placeholder="Nama kamu"
          />
        </div>
        {nameMessage && <p className={`msg ${nameMessage.type}`}>{nameMessage.text}</p>}
        <button type="submit" disabled={savingName} className="btn-primary">
          {savingName ? 'Menyimpan...' : 'Simpan Nama'}
        </button>
      </form>

      <form className="card" onSubmit={handleChangePassword}>
        <h2>Ganti Password</h2>
        <div className="field">
          <label>Password Baru</label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
            placeholder="Min. 8 karakter"
          />
        </div>
        {passwordMessage && <p className={`msg ${passwordMessage.type}`}>{passwordMessage.text}</p>}
        <button type="submit" disabled={savingPassword} className="btn-primary">
          {savingPassword ? 'Menyimpan...' : 'Ganti Password'}
        </button>
      </form>

      <style>{`
        .profile-page { padding: 32px; max-width: 480px; }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 8px;
        }
        h1 { font-size: 24px; margin: 0 0 24px; color: var(--navy); }

        .card {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .card h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--navy); margin: 0; }

        .readonly-row { display: flex; justify-content: space-between; font-size: 14px; }
        .readonly-row .label { color: var(--brown); }
        .readonly-row .value { color: var(--ink); font-weight: 500; }

        .field { display: flex; flex-direction: column; gap: 6px; }
        label { font-size: 13px; font-weight: 600; color: var(--brown); }

        .msg { font-size: 13px; margin: 0; }
        .msg.error { color: #b3261e; }
        .msg.success { color: var(--navy); }

        button { align-self: flex-start; }
      `}</style>
    </div>
  );
}
