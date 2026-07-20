'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button onClick={handleLogout} className="logout-btn">
      Keluar
      <style jsx>{`
        .logout-btn {
          background: transparent;
          border: 1px solid rgba(255, 239, 202, 0.35);
          color: var(--cream);
          font-size: 12px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 999px;
          cursor: pointer;
        }
        .logout-btn:hover {
          background: rgba(255, 239, 202, 0.1);
        }
      `}</style>
    </button>
  );
}
