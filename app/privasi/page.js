import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { siteConfig } from '@/lib/site-config';

export default function PrivasiPage() {
  return (
    <div className="privasi-page">
      <PublicNav />

      <section className="content">
        <p className="eyebrow">Kebijakan</p>
        <h1>Kebijakan Privasi</h1>
        <p className="updated">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</p>

        <h2>1. Data yang Kami Kumpulkan</h2>
        <p>
          {siteConfig.productName} mengumpulkan data publik dari platform media sosial (TikTok, YouTube)
          dan berita terkait brand yang Anda daftarkan untuk dipantau. Kami juga menyimpan data akun
          (nama, email) untuk keperluan login dan komunikasi layanan.
        </p>

        <h2>2. Cara Kami Menggunakan Data</h2>
        <p>
          Data yang dikumpulkan digunakan semata-mata untuk menghasilkan analisis dan laporan terkait
          brand yang Anda daftarkan. Kami tidak menjual atau membagikan data Anda ke pihak ketiga di
          luar keperluan operasional layanan ini.
        </p>

        <h2>3. Keamanan Data</h2>
        <p>
          Akses ke data brand dibatasi berdasarkan peran pengguna (Super Admin, Admin, Client) dan
          hanya dapat diakses oleh pihak yang berwenang atas brand terkait.
        </p>

        <h2>4. Retensi Data</h2>
        <p>
          Data operasional disimpan selama masa aktif langganan. Anda dapat meminta penghapusan data
          brand Anda dengan menghubungi kami langsung.
        </p>

        <h2>5. Kontak</h2>
        <p>
          Pertanyaan seputar kebijakan privasi ini dapat disampaikan melalui kanal kontak yang tersedia
          di halaman utama.
        </p>

        <p className="disclaimer">
          Halaman ini adalah draf awal kebijakan privasi dan disarankan untuk ditinjau oleh penasihat
          hukum sebelum digunakan secara resmi untuk kebutuhan komersial.
        </p>
      </section>

      <PublicFooter />

      <style>{`
        .privasi-page { background: var(--white); }
        .content {
          max-width: 680px;
          margin: 0 auto;
          padding: 56px 28px 72px;
        }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 12px;
        }
        h1 { font-family: 'Fraunces', serif; font-size: 30px; color: var(--navy); margin: 0 0 8px; }
        .updated { font-size: 13px; color: var(--brown); margin: 0 0 32px; }
        h2 { font-size: 17px; color: var(--navy); margin: 32px 0 10px; }
        p { font-size: 14px; line-height: 1.75; color: var(--ink); margin: 0 0 4px; }
        .disclaimer {
          margin-top: 40px;
          padding: 16px 18px;
          background: var(--cream);
          border-radius: 10px;
          font-size: 13px;
          color: var(--brown);
        }
      `}</style>
    </div>
  );
}
