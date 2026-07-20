'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

const NAV_BY_ROLE = {
  super_admin: [
    { href: '/dashboard/brands', label: 'Brands' },
    { href: '/dashboard/export', label: 'Export' },
    { href: '/dashboard/team', label: 'Tim' },
  ],
  admin: [
    { href: '/dashboard/my-scans', label: 'Brand Saya' },
    { href: '/dashboard/export', label: 'Export' },
  ],
  client: [{ href: '/dashboard/client', label: 'Dashboard' }],
};

const ROLE_LABEL = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  client: 'Client',
};

export default function DashboardNav({ role, email, fullName }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role] ?? [];
  const displayName = fullName?.trim() ? fullName : email;

  return (
    <header className="dashboard-nav">
      <div className="left">
        <Link href="/" className="logo">
          Nadi
        </Link>
        <nav className="links">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname.startsWith(item.href) ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/dashboard/profile" className={pathname.startsWith('/dashboard/profile') ? 'active' : ''}>
            Profil
          </Link>
        </nav>
      </div>

      <div className="right">
        <span className="role-tag">{ROLE_LABEL[role] ?? role}</span>
        <span className="email">{displayName}</span>
        <LogoutButton />
      </div>

      <style jsx>{`
        .dashboard-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 32px;
          background: var(--navy);
          flex-wrap: wrap;
          gap: 12px;
        }
        .left {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .logo {
          font-family: 'Fraunces', serif;
          font-size: 19px;
          font-weight: 600;
          color: var(--cream);
          text-decoration: none;
        }
        .links {
          display: flex;
          gap: 20px;
        }
        .links :global(a) {
          color: rgba(255, 239, 202, 0.7);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          padding-bottom: 2px;
          border-bottom: 2px solid transparent;
        }
        .links :global(a:hover) {
          color: var(--cream);
        }
        .links :global(a.active) {
          color: var(--cream);
          border-bottom-color: var(--gold);
        }
        .right {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .role-tag {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--gold);
        }
        .email {
          font-size: 12px;
          color: rgba(255, 239, 202, 0.6);
        }
      `}</style>
    </header>
  );
}
