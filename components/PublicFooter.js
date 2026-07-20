import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export default function PublicFooter() {
  return (
    <footer className="public-footer">
      <p>{siteConfig.productName} — Brand Intelligence System.</p>
      <div className="footer-links">
        <Link href="/privasi">Kebijakan Privasi</Link>
        <Link href="/tentang">Tentang</Link>
        <Link href="/login">Masuk</Link>
      </div>

      <style>{`
        .public-footer {
          text-align: center;
          padding: 28px;
          font-size: 12px;
          color: var(--brown);
          background: var(--white);
        }
        .public-footer p {
          margin: 0 0 8px;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .footer-links a {
          color: var(--navy);
          font-weight: 500;
          text-decoration: none;
        }
      `}</style>
    </footer>
  );
}
