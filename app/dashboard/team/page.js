import { createClient } from '@/lib/supabase-server';
import TeamInviteForm from '@/components/TeamInviteForm';
import ManageBrandsButton from '@/components/ManageBrandsButton';
import Reveal from '@/components/Reveal';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const supabase = createClient();

  const [{ data: profiles }, { data: brands }] = await Promise.all([
    supabase.from('profiles').select('id, role, full_name, created_at').order('created_at', { ascending: false }),
    supabase.from('brands').select('id, name').order('name'),
  ]);

  const roleLabel = { super_admin: 'Super Admin', admin: 'Admin', client: 'Client' };
  const roleClass = { super_admin: 'super', admin: 'admin', client: 'client' };

  return (
    <div className="team-page">
      <h1>Tim</h1>
      <p className="sub">Kelola akses Admin & Client. Undangan dikirim via email, tanpa batas jumlah slot.</p>

      <Reveal>
        <section className="members">
          <h2>Anggota ({profiles?.length ?? 0})</h2>
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Role</th>
                <th>Bergabung</th>
                <th>Brand</th>
              </tr>
            </thead>
            <tbody>
              {profiles?.map((p) => (
                <tr key={p.id}>
                  <td>{p.full_name ?? '—'}</td>
                  <td>
                    <span className={`role-badge role-${roleClass[p.role] ?? 'client'}`}>
                      {roleLabel[p.role] ?? p.role}
                    </span>
                  </td>
                  <td>{new Date(p.created_at).toLocaleDateString('id-ID')}</td>
                  <td>
                    {p.role !== 'super_admin' && (
                      <ManageBrandsButton userId={p.id} userName={p.full_name} brands={brands ?? []} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </Reveal>

      <Reveal delay={100}>
        <section className="invite">
          <h2>Undang Anggota Baru</h2>
          <TeamInviteForm brands={brands ?? []} />
        </section>
      </Reveal>

      <style>{`
        .team-page { padding: 32px; max-width: 900px; }
        .sub { color: var(--brown); font-size: 14px; margin-bottom: 32px; }
        h1 { font-size: 26px; margin: 0 0 4px; color: var(--navy); }
        h2 { font-size: 16px; margin: 0 0 16px; color: var(--navy); }
        .members { margin-bottom: 40px; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--line); }
        th { color: var(--brown); font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
        .role-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }
        .role-super { background: var(--role-super-bg); color: var(--role-super-tx); border: 1px solid var(--role-super-bd); }
        .role-admin { background: var(--role-admin-bg); color: var(--role-admin-tx); border: 1px solid var(--role-admin-bd); }
        .role-client { background: var(--role-client-bg); color: var(--role-client-tx); border: 1px solid var(--role-client-bd); }
      `}</style>
    </div>
  );
}
