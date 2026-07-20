import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export default function PublicNav() {
  return (
    <header className="public-nav">
      <Link href="/" className="logo">
        {siteConfig.productName}
      </Link>
      <nav className="links">
        <Link href="/harga">Harga</Link>
        <Link href="/tentang">Tentang</Link>
        <Link href="/login" className="nav-login">
          Masuk
        </Link>
      </nav>

      <style>{`
        .public-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
          background: var(--navy);
        }
        .logo {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--cream);
          text-decoration: none;
        }
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
        .links a:hover {
          color: var(--cream);
        }
        .nav-login {
          border: 1px solid rgba(255,239,202,0.4) !important;
          padding: 7px 18px;
          border-radius: 999px;
          color: var(--cream) !important;
        }
      `}</style>
    </header>
  );
}
