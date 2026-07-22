'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function NotificationBell() {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadNotifications() {
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('id, type, message, status, created_at, brands(name)')
      .order('created_at', { ascending: false })
      .limit(20);
    setNotifications(data ?? []);
    setLoading(false);
  }

  const unreadCount = notifications.filter((n) => n.status !== 'read').length;

  async function markAsRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n)));
    await supabase.from('notifications').update({ status: 'read' }).eq('id', id);
  }

  async function markAllAsRead() {
    const unreadIds = notifications.filter((n) => n.status !== 'read').map((n) => n.id);
    if (unreadIds.length === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })));
    await supabase.from('notifications').update({ status: 'read' }).in('id', unreadIds);
  }

  return (
    <div className="notif-wrap">
      <button className="bell-btn" onClick={() => setOpen((v) => !v)} aria-label="Notifikasi">
        <svg viewBox="0 0 24 24" className="bell-icon">
          <path
            d="M12 3a5 5 0 00-5 5v3.2c0 .6-.2 1.2-.6 1.7L5 15h14l-1.4-2.1c-.4-.5-.6-1.1-.6-1.7V8a5 5 0 00-5-5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M9.5 18a2.5 2.5 0 005 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        {unreadCount > 0 && <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <>
          <div className="backdrop" onClick={() => setOpen(false)} />
          <div className="panel">
            <div className="panel-header">
              <p className="panel-title">Notifikasi</p>
              {unreadCount > 0 && (
                <button className="mark-all-btn" onClick={markAllAsRead}>
                  Tandai semua dibaca
                </button>
              )}
            </div>

            <div className="panel-body">
              {loading ? (
                <p className="empty-text">Memuat...</p>
              ) : notifications.length === 0 ? (
                <p className="empty-text">Belum ada notifikasi.</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    className={`notif-item ${n.status !== 'read' ? 'unread' : ''}`}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className="notif-item-top">
                      <span className="notif-type">{n.type}</span>
                      {n.status !== 'read' && <span className="unread-dot" />}
                    </div>
                    {n.brands?.name && <p className="notif-brand">{n.brands.name}</p>}
                    <p className="notif-message">{n.message}</p>
                    <p className="notif-date">{timeAgo(n.created_at)}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .notif-wrap { position: relative; }
        .bell-btn {
          position: relative;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: var(--cream);
          display: flex;
          align-items: center;
        }
        .bell-icon { width: 20px; height: 20px; }
        .badge {
          position: absolute;
          top: -2px;
          right: -4px;
          background: var(--gold);
          color: var(--navy);
          font-size: 10px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 999px;
          min-width: 16px;
          text-align: center;
        }

        .backdrop { position: fixed; inset: 0; z-index: 90; background: transparent; }
        .panel {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 340px;
          max-width: 90vw;
          max-height: 420px;
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 14px;
          box-shadow: 0 16px 40px rgba(42, 38, 32, 0.15);
          z-index: 91;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid var(--line);
        }
        .panel-title { font-size: 14px; font-weight: 700; color: var(--navy); margin: 0; }
        .mark-all-btn {
          background: transparent;
          border: none;
          color: var(--brown);
          font-size: 11px;
          cursor: pointer;
          text-decoration: underline;
        }
        .mark-all-btn:hover { color: var(--navy); }

        .panel-body { overflow-y: auto; }
        .empty-text { padding: 24px 16px; font-size: 13px; color: var(--brown); text-align: center; margin: 0; }

        .notif-item {
          display: block;
          width: 100%;
          text-align: left;
          background: var(--white);
          border: none;
          border-bottom: 1px solid var(--line);
          padding: 12px 16px;
          cursor: pointer;
        }
        .notif-item:hover { background: var(--cream); }
        .notif-item.unread { background: #FFFBF0; }
        .notif-item-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .notif-type {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--brown);
          background: var(--cream);
          padding: 2px 8px;
          border-radius: 999px;
        }
        .unread-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); }
        .notif-brand { font-size: 12px; font-weight: 700; color: var(--navy); margin: 0 0 2px; }
        .notif-message { font-size: 13px; color: var(--ink); margin: 0 0 4px; line-height: 1.4; }
        .notif-date { font-size: 11px; color: var(--brown); margin: 0; }
      `}</style>
    </div>
  );
}

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}
