import { createClient } from '@/lib/supabase-server';
import DashboardNav from '@/components/DashboardNav';
import DashboardFooter from '@/components/DashboardFooter';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user?.id)
    .single();

  return (
    <div className="dashboard-shell">
      <DashboardNav role={profile?.role ?? 'client'} email={user?.email ?? ''} fullName={profile?.full_name} />
      <main>{children}</main>
      <DashboardFooter />
    </div>
  );
}
