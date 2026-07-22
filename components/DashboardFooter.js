import { siteConfig } from '@/lib/site-config';

export default function DashboardFooter() {
  return (
    <footer className="dashboard-footer">
      <p>
        {siteConfig.productName} — Brand Intelligence System. © {new Date().getFullYear()}
      </p>
      <style>{`
        .dashboard-footer {
          text-align: center;
          padding: 24px;
          font-size: 12px;
          color: var(--brown);
          border-top: 1px solid var(--line);
          margin-top: 40px;
        }
      `}</style>
    </footer>
  );
}
