import { createClient } from '@/lib/supabase-server';
import EditBrandForm from '@/components/EditBrandForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditBrandPage({ params }) {
  const supabase = createClient();
  const { data: brand } = await supabase.from('brands').select('*').eq('id', params.id).single();

  if (!brand) {
    return (
      <div style={{ padding: 32 }}>
        <p>Brand tidak ditemukan.</p>
        <Link href="/dashboard/brands">← Kembali ke daftar Brands</Link>
      </div>
    );
  }

  return (
    <div className="edit-brand-page">
      <p className="eyebrow">Super Admin</p>
      <h1>Edit Brand</h1>
      <p className="sub">
        <Link href={`/dashboard/brands/${brand.id}`}>← Kembali ke detail {brand.name}</Link>
      </p>

      <EditBrandForm brand={brand} />

      <style>{`
        .edit-brand-page { padding: 40px 32px; max-width: 640px; margin: 0 auto; }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 8px;
        }
        h1 { font-size: 26px; margin: 0 0 10px; color: var(--navy); }
        .sub { margin: 0 0 28px; font-size: 13px; }
        .sub :global(a) { color: var(--brown); }
      `}</style>
    </div>
  );
}
