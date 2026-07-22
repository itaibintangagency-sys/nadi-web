'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import PulseLogo from '@/components/PulseLogo';
import NotificationBell from '@/components/NotificationBell';

const NAV_BY_ROLE = {
  super_admin: [
    { href: '/dashboard/brands', label: 'Brands' },
    { href: '/dashboard/alerts', label: 'Alerts' },
    { href: '/dashboard/reports', label: 'Reports' },
    { href: '/dashboard/export', label: 'Export' },
    { href: '/dashboard/team', label: 'Tim' },
  ],
  admin: [
    { href: '/dashboard/my-scans', label: 'Brand Saya' },
    { href: '/dashboard/alerts', label: 'Alerts' },
    { href: '/dashboard/reports', label: 'Reports' },
    { href: '/dashboard/export', label: 'Export' },
  ],
  client: [
    { href: '/dashboard/client', label: 'Dashboard' },
    { href: '/dashboard/alerts', label: 'Alerts' },
    { href: '/dashboard/reports', label: 'Reports' },
  ],
};

const ROLE_LABEL = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  client: 'Client',
};

export default function DashboardNav({ role, email, fullName }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const items = NAV_BY_ROLE[role] ?? [];
  const displayName = fullName?.trim() ? fullName : email;

  const allItems = [...items, { href: '/dashboard/profile', label: 'Profil' }];

  return (
    <header className="dashboard-nav">
      <div className="bar">
        <Link href="/" className="logo-link">
          <PulseLogo size="small" />
        </Link>

        <nav className="links">
          {allItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname.startsWith(item.href) ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="right">
          <NotificationBell />
          <span className="role-tag">{ROLE_LABEL[role] ?? role}</span>
          <span className="email">{displayName}</span>
          <LogoutButton />
        </div>

        <div className="mobile-actions">
          <NotificationBell />
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
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {allItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname.startsWith(item.href) ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mobile-menu-footer">
            <span className="role-tag">{ROLE_LABEL[role] ?? role}</span>
            <span className="email">{displayName}</span>
            <LogoutButton />
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--navy);
        }
        .bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 32px;
          gap: 20px;
        }
        .logo-link { text-decoration: none; flex-shrink: 0; }

        .links {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          flex: 1;
        }
        .links::-webkit-scrollbar { display: none; }
        .links :global(a) {
          color: rgba(255, 239, 202, 0.7);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          padding-bottom: 2px;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .links :global(a:hover) { color: var(--cream); }
        .links :global(a.active) { color: var(--cream); border-bottom-color: var(--gold); }

        .right {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }
        .role-tag {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--gold);
        }
        .email { font-size: 12px; color: rgba(255, 239, 202, 0.6); }

        .mobile-actions {
          display: none;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
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
          flex-shrink: 0;
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

        .mobile-menu {
          display: none;
        }

        @media (max-width: 720px) {
          .bar { padding: 12px 20px; }
          .links, .right { display: none; }
          .mobile-actions { display: flex; }
          .hamburger { display: flex; }

          .mobile-menu {
            display: flex;
            flex-direction: column;
            padding: 8px 20px 20px;
            gap: 4px;
            border-top: 1px solid rgba(255, 239, 202, 0.15);
            animation: slideDown 0.2s ease;
          }
          .mobile-menu :global(a) {
            color: rgba(255, 239, 202, 0.8);
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            padding: 10px 4px;
            border-bottom: 1px solid rgba(255, 239, 202, 0.08);
          }
          .mobile-menu :global(a.active) { color: var(--gold); font-weight: 700; }
          .mobile-menu-footer {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-top: 14px;
            flex-wrap: wrap;
          }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
