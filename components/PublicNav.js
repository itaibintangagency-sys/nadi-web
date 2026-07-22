'use client';

import { useState } from 'react';
import Link from 'next/link';
import PulseLogo from '@/components/PulseLogo';

export default function PublicNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="public-nav">
      <div className="bar">
        <Link href="/" className="logo-link">
          <PulseLogo size="small" />
        </Link>

        <nav className="links">
          <Link href="/harga">Harga</Link>
          <Link href="/tentang">Tentang</Link>
          <Link href="/login" className="nav-login">
            Masuk
          </Link>
        </nav>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <Link href="/harga" onClick={() => setMenuOpen(false)}>Harga</Link>
          <Link href="/tentang" onClick={() => setMenuOpen(false)}>Tentang</Link>
          <Link href="/login" onClick={() => setMenuOpen(false)} className="mobile-login">
            Masuk
          </Link>
        </div>
      )}

      <style>{`
        .public-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--navy);
        }
        .bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 32px;
        }
        .logo-link { text-decoration: none; }

        .links {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .links a {
          color: rgba(255,239,202,0.85);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
        }
        .links a:hover { color: var(--cream); }
        .nav-login {
          border: 1px solid rgba(255,239,202,0.4) !important;
          padding: 7px 18px;
          border-radius: 999px;
          color: var(--cream) !important;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .hamburger span {
          display: block;
          width: 100%;
          height: 2px;
          background: var(--cream);
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.2s ease;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .mobile-menu { display: none; }

        @media (max-width: 720px) {
          .bar { padding: 14px 20px; }
          .links { display: none; }
          .hamburger { display: flex; }

          .mobile-menu {
            display: flex;
            flex-direction: column;
            padding: 8px 20px 20px;
            gap: 4px;
            border-top: 1px solid rgba(255, 239, 202, 0.15);
            animation: slideDown 0.2s ease;
          }
          .mobile-menu a {
            color: rgba(255, 239, 202, 0.85);
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            padding: 10px 4px;
            border-bottom: 1px solid rgba(255, 239, 202, 0.08);
          }
          .mobile-login { color: var(--gold) !important; font-weight: 700 !important; }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
