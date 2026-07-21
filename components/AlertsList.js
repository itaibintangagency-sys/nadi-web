'use client';

import { useMemo, useState } from 'react';

const severityStyle = {
  critical: { bg: '#FAECE7', tx: '#8B2E2E' },
  high: { bg: '#FAECE7', tx: '#993C1D' },
  medium: { bg: '#FBF3DC', tx: '#8C6D0A' },
  low: { bg: '#E8EDF7', tx: '#223A78' },
};

export default function AlertsList({ alerts: initialAlerts, canResolve }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState('unresolved'); // 'all' | 'unresolved' | 'resolved'
  const [resolvingId, setResolvingId] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'unresolved') return alerts.filter((a) => !a.resolved);
    if (filter === 'resolved') return alerts.filter((a) => a.resolved);
    return alerts;
  }, [alerts, filter]);

  async function handleResolve(id) {
    setResolvingId(id);
    const res = await fetch(`/api/alerts/${id}`, { method: 'PATCH' });
    setResolvingId(null);

    if (res.ok) {
      const { alert } = await res.json();
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true, resolved_at: alert.resolved_at } : a)));
    }
  }

  return (
    <div className="alerts-list">
      <div className="filter-bar">
        {['unresolved', 'resolved', 'all'].map((f) => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f === 'unresolved' ? 'Belum Selesai' : f === 'resolved' ? 'Selesai' : 'Semua'}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="empty-hint">Tidak ada alert di kategori ini.</p>}

      <div className="cards">
        {filtered.map((a) => {
          const sev = severityStyle[a.severity] ?? severityStyle.low;
          return (
            <div key={a.id} className={`alert-card ${a.resolved ? 'resolved' : ''}`}>
              <div className="alert-top">
                <span className="severity-badge" style={{ background: sev.bg, color: sev.tx }}>
                  {a.severity ?? 'info'}
                </span>
                <span className="type-tag">{a.type}</span>
                {a.visibility === 'client' && <span className="visibility-tag">Terlihat oleh Client</span>}
              </div>
              <p className="brand-name">{a.brands?.name ?? 'Brand tidak diketahui'}</p>
              <p className="description">{a.description}</p>
              <div className="alert-bottom">
                <span className="date">{new Date(a.detected_at).toLocaleString('id-ID')}</span>
                {a.resolved ? (
                  <span className="resolved-tag">✓ Selesai</span>
                ) : (
                  canResolve && (
                    <button onClick={() => handleResolve(a.id)} disabled={resolvingId === a.id} className="resolve-btn">
                      {resolvingId === a.id ? 'Menyimpan...' : 'Tandai Selesai'}
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .filter-bar { display: flex; gap: 8px; margin-bottom: 20px; }
        .filter-bar button {
          padding: 7px 16px; border-radius: 999px; border: 1px solid var(--line);
          background: var(--white); color: var(--brown); font-size: 12px; font-weight: 600; cursor: pointer;
        }
        .filter-bar button.active { background: var(--navy); color: var(--white); border-color: var(--navy); }

        .empty-hint { font-size: 13px; color: var(--brown); }

        .cards { display: flex; flex-direction: column; gap: 12px; }
        .alert-card {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 18px 20px;
        }
        .alert-card.resolved { opacity: 0.6; }

        .alert-top { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; flex-wrap: wrap; }
        .severity-badge {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          padding: 3px 10px; border-radius: 999px;
        }
        .type-tag { font-size: 11px; color: var(--brown); background: var(--cream); padding: 3px 10px; border-radius: 999px; }
        .visibility-tag { font-size: 10px; color: var(--gold); font-weight: 700; }

        .brand-name { font-size: 13px; font-weight: 700; color: var(--navy); margin: 0 0 4px; }
        .description { font-size: 14px; color: var(--ink); margin: 0 0 12px; line-height: 1.6; }

        .alert-bottom { display: flex; justify-content: space-between; align-items: center; }
        .date { font-size: 12px; color: var(--brown); }
        .resolved-tag { font-size: 12px; color: #0F6E5C; font-weight: 600; }
        .resolve-btn {
          font-size: 12px; font-weight: 600; color: var(--navy); background: var(--white);
          border: 1px solid var(--navy); padding: 5px 14px; border-radius: 8px; cursor: pointer;
        }
        .resolve-btn:hover { background: var(--navy); color: var(--white); }
      `}</style>
    </div>
  );
}
