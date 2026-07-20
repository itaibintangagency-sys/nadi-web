'use client';

import { useState } from 'react';

export default function BrandTabs({ digest, posts, comments }) {
  const [active, setActive] = useState('insight');

  return (
    <div className="brand-tabs">
      <div className="tab-bar">
        <button className={active === 'insight' ? 'active' : ''} onClick={() => setActive('insight')}>
          Insight
        </button>
        <button className={active === 'video' ? 'active' : ''} onClick={() => setActive('video')}>
          Video ({posts.length})
        </button>
        <button className={active === 'komentar' ? 'active' : ''} onClick={() => setActive('komentar')}>
          Komentar ({comments.length})
        </button>
      </div>

      <div className="tab-content">
        {active === 'insight' && <InsightTab digest={digest} />}
        {active === 'video' && <VideoTab posts={posts} />}
        {active === 'komentar' && <KomentarTab comments={comments} />}
      </div>

      <style jsx>{`
        .tab-bar {
          display: flex;
          gap: 4px;
          border-bottom: 1px solid var(--line);
          margin-bottom: 24px;
        }
        .tab-bar button {
          padding: 10px 18px;
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 500;
          color: var(--brown);
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }
        .tab-bar button.active {
          color: var(--navy);
          border-bottom-color: var(--gold);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

function InsightTab({ digest }) {
  if (!digest) {
    return <EmptyState text="Belum ada ringkasan insight untuk brand ini. Insight akan muncul otomatis setelah scan pertama selesai diproses." />;
  }

  return (
    <div className="insight-tab">
      <p className="digest-date">
        Ringkasan {new Date(digest.digest_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      {digest.brand_score != null && (
        <div className="score-row">
          <span className="score-label">Brand Score</span>
          <span className="score-value">{digest.brand_score}</span>
        </div>
      )}
      <p className="digest-text">{digest.digest_text}</p>

      <style jsx>{`
        .digest-date { font-size: 12px; color: var(--brown); margin: 0 0 12px; }
        .score-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px; }
        .score-label { font-size: 13px; color: var(--brown); }
        .score-value { font-size: 24px; font-weight: 700; color: var(--navy); font-family: 'Fraunces', serif; }
        .digest-text { font-size: 14px; line-height: 1.8; color: var(--ink); white-space: pre-wrap; }
      `}</style>
    </div>
  );
}

function VideoTab({ posts }) {
  if (posts.length === 0) {
    return <EmptyState text="Belum ada video yang terkumpul untuk brand ini." />;
  }

  return (
    <div className="video-list">
      {posts.map((p) => (
        <div key={p.id} className="video-row">
          <div className="video-main">
            <span className="platform-tag">{p.platform}</span>
            <p className="caption">{p.caption || '(tanpa caption)'}</p>
            <p className="author">@{p.author || 'unknown'}</p>
          </div>
          <div className="video-stats">
            <span>{formatNum(p.views)} views</span>
            <span>{formatNum(p.likes)} likes</span>
            <span>{formatNum(p.comments_count)} komentar</span>
          </div>
        </div>
      ))}

      <style jsx>{`
        .video-list { display: flex; flex-direction: column; gap: 10px; }
        .video-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          border: 1px solid var(--line);
          border-radius: 12px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .video-main { flex: 1; min-width: 200px; }
        .platform-tag {
          display: inline-block;
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--brown);
          background: var(--cream);
          padding: 2px 8px;
          border-radius: 999px;
          margin-bottom: 6px;
        }
        .caption { font-size: 13px; color: var(--ink); margin: 0 0 4px; }
        .author { font-size: 12px; color: var(--brown); margin: 0; }
        .video-stats { display: flex; gap: 14px; font-size: 12px; color: var(--brown); white-space: nowrap; }
      `}</style>
    </div>
  );
}

function KomentarTab({ comments }) {
  if (comments.length === 0) {
    return <EmptyState text="Belum ada komentar yang terkumpul untuk brand ini." />;
  }

  return (
    <div className="comment-list">
      {comments.map((c) => (
        <div key={c.id} className="comment-row">
          <p className="author">@{c.author || 'unknown'}</p>
          <p className="content">{c.content}</p>
        </div>
      ))}

      <style jsx>{`
        .comment-list { display: flex; flex-direction: column; gap: 10px; }
        .comment-row {
          padding: 12px 16px;
          border: 1px solid var(--line);
          border-radius: 12px;
        }
        .author { font-size: 12px; font-weight: 600; color: var(--navy); margin: 0 0 4px; }
        .content { font-size: 13px; color: var(--ink); margin: 0; line-height: 1.5; }
      `}</style>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty">
      <p>{text}</p>
      <style jsx>{`
        .empty {
          text-align: center;
          padding: 48px 24px;
          color: var(--brown);
          font-size: 14px;
          border: 1px dashed var(--line);
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}

function formatNum(n) {
  if (n == null) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'jt';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'rb';
  return String(n);
}
