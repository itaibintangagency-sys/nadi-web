import { createClient } from '@/lib/supabase-server';
import TeamInviteForm from '@/components/TeamInviteForm';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const supabase = createClient();

  const [{ data: profiles }, { data: brands }] = await Promise.all([
    supabase.from('profiles').select('id, role, full_name, created_at').order('created_at', { ascending: false }),
    supabase.from('brands').select('id, name').order('name'),
  ]);

  const roleLabel = { super_admin: 'Super Admin', admin: 'Admin', client: 'Client' };

  return (
    <div className="team-page">
      <h1>Tim</h1>
      <p className="sub">Kelola akses Admin & Client. Undangan dikirim via email, tanpa batas jumlah slot.</p>

      <section className="members">
        <h2>Anggota ({profiles?.length ?? 0})</h2>
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Role</th>
              <th>Bergabung</th>
            </tr>
          </thead>
          <tbody>
            {profiles?.map((p) => (
              <tr key={p.id}>
                <td>{p.full_name ?? '—'}</td>
                <td>
                  <span className={`role-badge role-${p.role}`}>{roleLabel[p.role] ?? p.role}</span>
                </td>
                <td>{new Date(p.created_at).toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="invite">
        <h2>Undang Anggota Baru</h2>
        <TeamInviteForm brands={brands ?? []} />
      </section>

      <style>{`
        .team-page { padding: 24px; max-width: 900px; }
        .sub { color: #57534e; font-size: 14px; margin-bottom: 32px; }
        h1 { font-family: Georgia, serif; font-size: 26px; margin: 0 0 4px; }
        h2 { font-size: 16px; margin: 0 0 16px; }
        .members { margin-bottom: 40px; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #eeece8; }
        th { color: #8a8a85; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
        .role-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }
        .role-super_admin { background: #FFF4E5; color: #7A3806; border: 1px solid #B4530A; }
        .role-admin { background: #E6F1FB; color: #0C447C; border: 1px solid #185FA5; }
        .role-client { background: #E1F5EE; color: #085041; border: 1px solid #0F6E5C; }
      `}</style>
    </div>
  );
}
