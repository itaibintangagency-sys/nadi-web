import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { siteConfig, getWhatsappUrl } from '@/lib/site-config';

export default function TentangPage() {
  return (
    <div className="tentang-page">
      <PublicNav />

      <section className="hero">
        <p className="eyebrow">Tentang Kami</p>
        <h1>Dibangun untuk brand yang ingin tahu duluan</h1>
      </section>

      <section className="content">
        <p>
          {siteConfig.productName} lahir dari kebutuhan sederhana: brand sering kali baru menyadari
          ada masalah setelah semuanya jadi viral — bukan saat masalah itu baru mulai muncul.
        </p>
        <p>
          Kami percaya keputusan yang baik butuh informasi yang datang tepat waktu, bukan cuma
          laporan bulanan yang sudah basi begitu dibaca. Karena itu {siteConfig.productName} dibangun
          untuk memantau, menyaring, dan menyampaikan yang penting — secepat itu terjadi.
        </p>
        <p>
          Kami bekerja dengan brand-brand di Indonesia yang ingin lebih dekat dengan percakapan
          publik tentang mereka, tanpa harus punya tim monitoring internal yang besar.
        </p>

        <div className="cta">
          <a href={getWhatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Ngobrol dengan Kami
          </a>
        </div>
      </section>

      <PublicFooter />

      <style>{`
        .tentang-page { background: var(--white); }
        .hero {
          background: var(--navy);
          color: var(--cream);
          text-align: center;
          padding: 64px 28px 48px;
        }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 14px;
        }
        .hero h1 {
          font-family: 'Fraunces', serif; font-weight: 600;
          font-size: clamp(26px, 4vw, 36px); max-width: 600px; margin: 0 auto; color: var(--white);
        }
        .content {
          max-width: 620px;
          margin: 0 auto;
          padding: 56px 28px 72px;
          text-align: center;
        }
        .content p {
          font-size: 15px;
          line-height: 1.8;
          color: var(--ink);
          margin: 0 0 20px;
          text-align: left;
        }
        .cta { margin-top: 32px; }
      `}</style>
    </div>
  );
}
