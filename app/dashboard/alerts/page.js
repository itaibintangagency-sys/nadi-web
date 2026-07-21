import { createClient } from '@/lib/supabase-server';
import AlertsList from '@/components/AlertsList';

export const dynamic = 'force-dynamic';

export default async function AlertsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  const canResolve = profile?.role === 'super_admin' || profile?.role === 'admin';

  const { data: alerts, error } = await supabase
    .from('anomaly_logs')
    .select('id, brand_id, type, severity, description, resolved, resolved_at, detected_at, visibility, brands(name)')
    .order('detected_at', { ascending: false });

  return (
    <div className="alerts-page">
      <p className="eyebrow">Alerts</p>
      <h1>Notifikasi Anomali</h1>
      <p className="sub">
        {alerts?.filter((a) => !a.resolved).length ?? 0} belum diselesaikan dari {alerts?.length ?? 0} total
      </p>

      {error && <p className="error-box">Gagal memuat data: {error.message}</p>}

      {!error && (!alerts || alerts.length === 0) && (
        <div className="empty-state">
          <p>Belum ada alert. Semua aman untuk sekarang.</p>
        </div>
      )}

      {alerts && alerts.length > 0 && <AlertsList alerts={alerts} canResolve={canResolve} />}

      <style>{`
        .alerts-page { padding: 32px; max-width: 900px; margin: 0 auto; }
        .eyebrow {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 0 0 8px;
        }
        h1 { font-size: 26px; margin: 0 0 4px; color: var(--navy); }
        .sub { font-size: 13px; color: var(--brown); margin: 0 0 28px; }
        .error-box {
          background: #FBEAEA; border: 1px solid #D9534F; color: #8B2E2E;
          padding: 12px 16px; border-radius: 10px; font-size: 13px; margin-bottom: 24px;
        }
        .empty-state {
          text-align: center; padding: 64px 24px; border: 1px dashed var(--line);
          border-radius: 16px; color: var(--brown);
        }
      `}</style>
    </div>
  );
}
