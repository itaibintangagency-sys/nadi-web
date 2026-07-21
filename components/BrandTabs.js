'use client';

import { useMemo, useState } from 'react';

const PAGE_SIZE_OPTIONS = [10, 30, 50, 100, 300, 500];

export default function BrandTabs({ digest, posts, comments, competitors, snapshots }) {
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
        {competitors?.length > 0 && (
          <button className={active === 'kompetitor' ? 'active' : ''} onClick={() => setActive('kompetitor')}>
            Kompetitor ({competitors.length})
          </button>
        )}
      </div>

      <div className="tab-content">
        {active === 'insight' && <InsightTab digest={digest} posts={posts} comments={comments} />}
        {active === 'video' && <VideoTable posts={posts} comments={comments} />}
        {active === 'komentar' && <KomentarTable comments={comments} />}
        {active === 'kompetitor' && <CompetitorTab competitors={competitors ?? []} snapshots={snapshots ?? []} />}
      </div>

      <style jsx>{`
        .tab-bar {
          display: flex;
          gap: 4px;
          border-bottom: 1px solid var(--line);
          margin-bottom: 28px;
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

function InsightTab({ digest, posts, comments }) {
  if (posts.length === 0 && !digest) {
    return <EmptyState text="Belum ada data untuk dianalisis. Insight akan muncul otomatis setelah scan pertama selesai diproses." />;
  }

  // ── Hitung insight langsung dari data yang sudah ada — tidak menunggu daily_digests ──
  const totalViews = posts.reduce((s, p) => s + (p.views || 0), 0);
  const totalLikes = posts.reduce((s, p) => s + (p.likes || 0), 0);
  const uniqueCreators = new Set(posts.map((p) => p.author).filter(Boolean)).size;
  const avgEr = posts.length > 0 ? posts.reduce((s, p) => s + (p.engagement_rate || 0), 0) / posts.length : 0;

  const topVideos = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  const byPlatform = posts.reduce((acc, p) => {
    const k = p.platform || 'lainnya';
    acc[k] = acc[k] || { count: 0, views: 0 };
    acc[k].count += 1;
    acc[k].views += p.views || 0;
    return acc;
  }, {});
  const platformEntries = Object.entries(byPlatform).sort((a, b) => b[1].views - a[1].views);

  const byCreator = posts.reduce((acc, p) => {
    const k = p.author || 'unknown';
    acc[k] = (acc[k] || 0) + (p.views || 0);
    return acc;
  }, {});
  const topCreators = Object.entries(byCreator)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const sentimentLabel = { positive: 'Positif', negative: 'Negatif', neutral: 'Netral', sarcasm: 'Sarkasme', spam: 'Spam' };
  const sentimentColor = {
    positive: { bg: '#E1F5EE', tx: '#0F6E5C' },
    negative: { bg: '#FAECE7', tx: '#993C1D' },
    neutral: { bg: '#E8EDF7', tx: '#223A78' },
    sarcasm: { bg: '#FBF3DC', tx: '#8C6D0A' },
    spam: { bg: '#F1ECE3', tx: '#5E5239' },
  };
  const analyzedComments = comments.filter((c) => c.sentiment);
  const bySentiment = analyzedComments.reduce((acc, c) => {
    acc[c.sentiment] = (acc[c.sentiment] || 0) + 1;
    return acc;
  }, {});
  const sentimentEntries = Object.entries(bySentiment).sort((a, b) => b[1] - a[1]);

  return (
    <div className="insight-tab">
      {posts.length > 0 && (
        <>
          {/* SECTION: Ringkasan Cepat */}
          <div className="insight-card">
            <h3>Ringkasan Cepat</h3>
            <p className="auto-summary">
              Brand ini punya <strong>{posts.length} video</strong> dari{' '}
              <strong>{uniqueCreators} creator</strong> dengan total{' '}
              <strong>{formatNum(totalViews)} views</strong> dan{' '}
              <strong>{formatNum(totalLikes)} likes</strong>. Rata-rata engagement rate berada di{' '}
              <strong>{avgEr.toFixed(2)}%</strong>{' '}
              {avgEr >= 5 ? '— tergolong baik.' : avgEr >= 2 ? '— tergolong wajar.' : '— masih di bawah rata-rata industri, perlu perhatian.'}
            </p>
          </div>

          {/* SECTION: Video Berperforma Terbaik */}
          <div className="insight-card">
            <h3>Video Berperforma Terbaik</h3>
            <div className="top-video-list">
              {topVideos.map((v, i) => (
                <div key={v.id} className="top-video-row">
                  <span className="rank">#{i + 1}</span>
                  <div className="top-video-info">
                    <p className="top-video-caption">{truncate(v.caption || '(tanpa caption)', 70)}</p>
                    <p className="top-video-meta">
                      @{v.author || 'unknown'} · {v.platform} · {formatNum(v.views)} views ·{' '}
                      {(v.engagement_rate ?? 0).toFixed(2)}% ER
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: Distribusi Platform */}
          <div className="insight-card">
            <h3>Distribusi Platform</h3>
            <div className="platform-list">
              {platformEntries.map(([platform, d]) => {
                const pct = totalViews > 0 ? ((d.views / totalViews) * 100).toFixed(0) : 0;
                return (
                  <div key={platform} className="platform-row">
                    <div className="platform-row-top">
                      <span className="platform-name">{platform}</span>
                      <span className="platform-count">{d.count} video · {formatNum(d.views)} views</span>
                    </div>
                    <div className="platform-bar-bg">
                      <div className="platform-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION: Top Creator */}
          <div className="insight-card">
            <h3>Top 5 Creator</h3>
            <ol className="creator-list">
              {topCreators.map(([creator, views]) => (
                <li key={creator}>
                  <span>{creator}</span>
                  <span className="creator-views">{formatNum(views)} views</span>
                </li>
              ))}
            </ol>
          </div>

          {/* SECTION: Distribusi Sentimen */}
          {sentimentEntries.length > 0 && (
            <div className="insight-card">
              <h3>Distribusi Sentimen Komentar</h3>
              <p className="sentiment-sub">{analyzedComments.length} dari {comments.length} komentar sudah dianalisis</p>
              <div className="sentiment-bars">
                {sentimentEntries.map(([sentiment, count]) => {
                  const pct = ((count / analyzedComments.length) * 100).toFixed(0);
                  const c = sentimentColor[sentiment] ?? sentimentColor.neutral;
                  return (
                    <div key={sentiment} className="sentiment-row">
                      <div className="sentiment-row-top">
                        <span className="sentiment-badge" style={{ background: c.bg, color: c.tx }}>
                          {sentimentLabel[sentiment] ?? sentiment}
                        </span>
                        <span className="sentiment-count">{count} ({pct}%)</span>
                      </div>
                      <div className="sentiment-bar-bg">
                        <div className="sentiment-bar-fill" style={{ width: `${pct}%`, background: c.tx }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* SECTION: Ringkasan dari Sistem (kalau sudah ada, dari WF-15) */}
      {digest && (
        <div className="insight-card">
          <h3>Ringkasan dari Sistem</h3>
          <p className="digest-date">
            {new Date(digest.digest_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          {digest.brand_score != null && (
            <div className="score-row">
              <span className="score-label">Brand Score</span>
              <span className="score-value">{digest.brand_score}</span>
            </div>
          )}
          <p className="digest-text">{digest.digest_text}</p>
        </div>
      )}

      <style jsx>{`
        .insight-tab { display: flex; flex-direction: column; gap: 18px; }
        .insight-card {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 22px;
        }
        .insight-card h3 {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--navy);
          margin: 0 0 14px;
        }
        .auto-summary { font-size: 14px; line-height: 1.8; color: var(--ink); margin: 0; }
        .auto-summary strong { color: var(--navy); }

        .top-video-list { display: flex; flex-direction: column; gap: 12px; }
        .top-video-row { display: flex; gap: 12px; align-items: flex-start; }
        .rank { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 700; color: var(--gold); min-width: 28px; }
        .top-video-caption { font-size: 13px; color: var(--ink); margin: 0 0 3px; }
        .top-video-meta { font-size: 12px; color: var(--brown); margin: 0; }

        .platform-list { display: flex; flex-direction: column; gap: 14px; }

        .sentiment-sub { font-size: 12px; color: var(--brown); margin: -8px 0 14px; }
        .sentiment-bars { display: flex; flex-direction: column; gap: 14px; }
        .sentiment-row-top { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .sentiment-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; }
        .sentiment-count { font-size: 12px; color: var(--brown); }
        .sentiment-bar-bg { height: 8px; background: var(--cream); border-radius: 999px; overflow: hidden; }
        .sentiment-bar-fill { height: 100%; border-radius: 999px; }
        .platform-row-top { display: flex; justify-content: space-between; margin-bottom: 6px; }
        .platform-name { font-size: 13px; font-weight: 600; color: var(--navy); text-transform: capitalize; }
        .platform-count { font-size: 12px; color: var(--brown); }
        .platform-bar-bg { height: 8px; background: var(--cream); border-radius: 999px; overflow: hidden; }
        .platform-bar-fill { height: 100%; background: var(--gold); border-radius: 999px; }

        .creator-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; counter-reset: creator; }
        .creator-list li {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--ink);
          padding: 8px 12px;
          background: var(--cream);
          border-radius: 8px;
        }
        .creator-views { color: var(--brown); font-weight: 600; }

        .digest-date { font-size: 12px; color: var(--brown); margin: 0 0 12px; }
        .score-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px; }
        .score-label { font-size: 13px; color: var(--brown); }
        .score-value { font-size: 24px; font-weight: 700; color: var(--navy); font-family: 'Fraunces', serif; }
        .digest-text { font-size: 14px; line-height: 1.8; color: var(--ink); white-space: pre-wrap; margin: 0; }
      `}</style>
    </div>
  );
}

// ── Kompetitor Tab ───────────────────────────────────────────────────────
function CompetitorTab({ competitors, snapshots }) {
  if (competitors.length === 0) {
    return <EmptyState text="Belum ada kompetitor yang ditandai untuk brand ini." />;
  }

  const latestByCompetitor = competitors.reduce((acc, name) => {
    const matches = snapshots.filter((s) => s.competitor_name === name);
    const latest = matches.sort((a, b) => new Date(b.snapshot_date) - new Date(a.snapshot_date))[0];
    acc[name] = latest ?? null;
    return acc;
  }, {});

  return (
    <div className="competitor-tab">
      {competitors.map((name) => {
        const snap = latestByCompetitor[name];
        return (
          <div key={name} className="competitor-card">
            <h3>{name}</h3>
            {!snap ? (
              <p className="no-data">Belum ada data perbandingan untuk kompetitor ini.</p>
            ) : (
              <>
                <div className="metric-row">
                  <div>
                    <span className="metric-label">Share of Voice</span>
                    <span className="metric-value">{snap.share_of_voice != null ? `${snap.share_of_voice}%` : '—'}</span>
                  </div>
                  <div>
                    <span className="metric-label">Engagement Rate</span>
                    <span className="metric-value">{snap.engagement_rate != null ? `${snap.engagement_rate}%` : '—'}</span>
                  </div>
                  <div>
                    <span className="metric-label">Update Terakhir</span>
                    <span className="metric-value-sm">{new Date(snap.snapshot_date).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                {snap.gap_analysis && (
                  <div className="gap-box">
                    <p className="gap-label">Gap Analysis</p>
                    <p className="gap-text">{snap.gap_analysis}</p>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}

      <style jsx>{`
        .competitor-tab { display: flex; flex-direction: column; gap: 16px; }
        .competitor-card {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 20px 22px;
        }
        .competitor-card h3 { font-size: 15px; color: var(--navy); margin: 0 0 12px; }
        .no-data { font-size: 13px; color: var(--brown); margin: 0; }

        .metric-row { display: flex; gap: 24px; margin-bottom: 14px; flex-wrap: wrap; }
        .metric-row > div { display: flex; flex-direction: column; gap: 2px; }
        .metric-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--brown); }
        .metric-value { font-size: 20px; font-weight: 700; color: var(--navy); font-family: 'Fraunces', serif; }
        .metric-value-sm { font-size: 13px; font-weight: 600; color: var(--ink); }

        .gap-box { background: var(--cream); border-radius: 10px; padding: 12px 14px; }
        .gap-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--brown); margin: 0 0 6px; }
        .gap-text { font-size: 13px; color: var(--ink); line-height: 1.6; margin: 0; }
      `}</style>
    </div>
  );
}


function sortData(data, sortKey, sortDir) {
  if (!sortKey) return data;
  return [...data].sort((a, b) => {
    let av = a[sortKey];
    let bv = b[sortKey];
    if (typeof av === 'string' || typeof bv === 'string') {
      av = (av ?? '').toString().toLowerCase();
      bv = (bv ?? '').toString().toLowerCase();
    } else {
      av = av ?? 0;
      bv = bv ?? 0;
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
}

function SortableTh({ label, sortKey, sort, setSort }) {
  const isActive = sort.key === sortKey;
  const arrow = isActive ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '';
  return (
    <th onClick={() => setSort(sortKey)} className={isActive ? 'active-sort' : ''}>
      {label}{arrow}
    </th>
  );
}

// ── Shared control bar ───────────────────────────────────────────────────
function TableControls({ search, setSearch, platform, setPlatform, platformOptions, pageSize, setPageSize, onExport, exportLabel }) {
  return (
    <div className="controls">
      <input
        type="text"
        placeholder="Cari caption atau creator..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field search-input"
      />
      <div className="controls-right">
        {platformOptions && (
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="page-size-select">
            <option value="all">Semua Platform</option>
            {platformOptions.map((p) => (
              <option key={p} value={p} style={{ textTransform: 'capitalize' }}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        )}
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="page-size-select">
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} / halaman
            </option>
          ))}
        </select>
        <button onClick={onExport} className="export-btn">
          ↓ {exportLabel}
        </button>
      </div>

      <style jsx>{`
        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .search-input { flex: 1; min-width: 200px; }
        .controls-right { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .page-size-select {
          padding: 9px 10px;
          border: 1px solid var(--line);
          border-radius: 8px;
          font-size: 13px;
          background: var(--white);
          color: var(--ink);
        }
        .export-btn {
          padding: 9px 16px;
          border-radius: 8px;
          border: 1px solid var(--navy);
          background: var(--white);
          color: var(--navy);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .export-btn:hover { background: var(--cream); }
      `}</style>
    </div>
  );
}

function Pagination({ page, totalPages, setPage, totalRows, pageSize }) {
  if (totalRows === 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalRows);

  return (
    <div className="pagination">
      <span className="range-text">
        {start}–{end} dari {totalRows}
      </span>
      <div className="page-buttons">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          ← Prev
        </button>
        <span className="page-indicator">
          Hal {page} / {totalPages}
        </span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          Next →
        </button>
      </div>

      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 18px;
          font-size: 12px;
          color: var(--brown);
          flex-wrap: wrap;
          gap: 10px;
        }
        .page-buttons { display: flex; align-items: center; gap: 10px; }
        .page-buttons button {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid var(--line);
          background: var(--white);
          color: var(--navy);
          font-size: 12px;
          cursor: pointer;
        }
        .page-buttons button:disabled { opacity: 0.4; cursor: not-allowed; }
        .page-indicator { color: var(--ink); }
      `}</style>
    </div>
  );
}

function downloadCsv(filename, rows, headers) {
  const csvRows = [
    headers.map((h) => h.label).join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = String(row[h.key] ?? '').replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(',')
    ),
  ];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function buildVideoLink(platform, author, postId) {
  if (!postId) return null;
  if (platform === 'tiktok' && author) return `https://www.tiktok.com/@${author}/video/${postId}`;
  if (platform === 'youtube') return `https://www.youtube.com/watch?v=${postId}`;
  if (platform === 'instagram') return `https://www.instagram.com/p/${postId}/`;
  return null;
}

// ── Side detail panel ────────────────────────────────────────────────────
function DetailPanel({ post, linkedComments, onClose }) {
  if (!post) return null;
  const link = buildVideoLink(post.platform, post.author, post.post_id);

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="panel">
        <div className="panel-header">
          <div>
            <span className="platform-tag">{post.platform}</span>
            <p className="panel-author">@{post.author || 'unknown'}</p>
          </div>
          <button onClick={onClose} className="close-btn" aria-label="Tutup">
            ×
          </button>
        </div>

        <p className="panel-caption">{post.caption || '(tanpa caption)'}</p>

        <div className="panel-stats">
          <div>
            <span className="stat-label">Views</span>
            <span className="stat-value">{formatNum(post.views)}</span>
          </div>
          <div>
            <span className="stat-label">Likes</span>
            <span className="stat-value">{formatNum(post.likes)}</span>
          </div>
          <div>
            <span className="stat-label">Comments</span>
            <span className="stat-value">{formatNum(post.comments_count)}</span>
          </div>
          <div>
            <span className="stat-label">ER</span>
            <span className="stat-value">{(post.engagement_rate ?? 0).toFixed(2)}%</span>
          </div>
        </div>

        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="panel-link">
            Buka video asli ↗
          </a>
        )}

        <div className="panel-divider" />

        <p className="panel-section-title">
          Komentar {linkedComments.length > 0 && `(${linkedComments.length})`}
        </p>

        {linkedComments.length === 0 ? (
          <p className="panel-empty">Belum ada komentar tersimpan untuk video ini.</p>
        ) : (
          <div className="panel-comments">
            {linkedComments.map((c) => (
              <div key={c.id} className="panel-comment">
                <span className="comment-author">@{c.author || 'unknown'}</span>
                <span className="comment-content">{c.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .backdrop {
          position: fixed;
          inset: 0;
          background: transparent;
          z-index: 40;
        }
        .panel {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 380px;
          max-width: 92vw;
          background: var(--white);
          border-left: 1px solid var(--line);
          box-shadow: -12px 0 32px rgba(42, 38, 32, 0.12);
          z-index: 50;
          padding: 24px;
          overflow-y: auto;
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .panel { animation: none; }
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
        }
        .platform-tag {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--brown);
          background: var(--cream);
          padding: 3px 9px;
          border-radius: 999px;
        }
        .panel-author { font-size: 15px; font-weight: 700; color: var(--navy); margin: 6px 0 0; }
        .close-btn {
          background: transparent;
          border: none;
          font-size: 22px;
          line-height: 1;
          color: var(--brown);
          cursor: pointer;
          padding: 0;
        }
        .close-btn:hover { color: var(--navy); }

        .panel-caption { font-size: 14px; color: var(--ink); line-height: 1.6; margin: 0 0 20px; }

        .panel-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        .panel-stats > div {
          background: var(--cream);
          border-radius: 10px;
          padding: 8px 6px;
          text-align: center;
        }
        .stat-label { display: block; font-size: 9px; text-transform: uppercase; color: var(--brown); margin-bottom: 2px; }
        .stat-value { display: block; font-size: 13px; font-weight: 700; color: var(--navy); }

        .panel-link {
          display: block;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: var(--navy);
          border: 1px solid var(--navy);
          border-radius: 8px;
          padding: 8px;
          text-decoration: none;
          margin-bottom: 20px;
        }
        .panel-link:hover { background: var(--navy); color: var(--white); }

        .panel-divider { height: 1px; background: var(--line); margin-bottom: 16px; }

        .panel-section-title {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          color: var(--navy);
          margin: 0 0 12px;
        }
        .panel-empty { font-size: 13px; color: var(--brown); }
        .panel-comments { display: flex; flex-direction: column; gap: 10px; }
        .panel-comment {
          background: var(--cream);
          border-radius: 8px;
          padding: 10px 12px;
        }
        .comment-author { display: block; font-size: 11px; font-weight: 700; color: var(--navy); margin-bottom: 3px; }
        .comment-content { display: block; font-size: 13px; color: var(--ink); line-height: 1.5; }
      `}</style>
    </>
  );
}

// ── Video Tab ────────────────────────────────────────────────────────────
function VideoTable({ posts, comments }) {
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('all');
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSortState] = useState({ key: 'views', dir: 'desc' });
  const [selectedPost, setSelectedPost] = useState(null);

  const platformOptions = useMemo(() => [...new Set(posts.map((p) => p.platform).filter(Boolean))], [posts]);

  function setSort(key) {
    setSortState((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }));
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let base = posts;
    if (platform !== 'all') base = base.filter((p) => p.platform === platform);
    if (q) base = base.filter((p) => (p.caption ?? '').toLowerCase().includes(q) || (p.author ?? '').toLowerCase().includes(q));
    return sortData(base, sort.key, sort.dir);
  }, [posts, search, platform, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  function handleExport() {
    downloadCsv(
      'video.csv',
      filtered.map((p) => ({
        creator: p.author,
        caption: p.caption,
        platform: p.platform,
        views: p.views,
        likes: p.likes,
        comments: p.comments_count,
        shares: p.shares,
        er: p.engagement_rate,
        tanggal: p.posted_at ? new Date(p.posted_at).toLocaleString('id-ID') : '',
        link: buildVideoLink(p.platform, p.author, p.post_id) ?? '',
      })),
      [
        { key: 'creator', label: 'Creator' },
        { key: 'caption', label: 'Caption' },
        { key: 'platform', label: 'Platform' },
        { key: 'views', label: 'Views' },
        { key: 'likes', label: 'Likes' },
        { key: 'comments', label: 'Comments' },
        { key: 'shares', label: 'Shares' },
        { key: 'er', label: 'ER' },
        { key: 'tanggal', label: 'Tanggal' },
        { key: 'link', label: 'Link' },
      ]
    );
  }

  if (posts.length === 0) {
    return <EmptyState text="Belum ada video yang terkumpul untuk brand ini." />;
  }

  const linkedComments = selectedPost ? comments.filter((c) => c.post_ref === selectedPost.id) : [];

  return (
    <div className="video-table">
      <TableControls
        search={search}
        setSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        platform={platform}
        setPlatform={(v) => {
          setPlatform(v);
          setPage(1);
        }}
        platformOptions={platformOptions}
        pageSize={pageSize}
        setPageSize={(v) => {
          setPageSize(v);
          setPage(1);
        }}
        onExport={handleExport}
        exportLabel={`Export CSV (${filtered.length})`}
      />

      <div className="table-scroll">
        <table>
          <colgroup>
            <col style={{ width: '13%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '7%' }} />
          </colgroup>
          <thead>
            <tr>
              <SortableTh label="Creator" sortKey="author" sort={sort} setSort={setSort} />
              <th>Caption</th>
              <SortableTh label="Platform" sortKey="platform" sort={sort} setSort={setSort} />
              <SortableTh label="Views" sortKey="views" sort={sort} setSort={setSort} />
              <SortableTh label="Likes" sortKey="likes" sort={sort} setSort={setSort} />
              <SortableTh label="Comments" sortKey="comments_count" sort={sort} setSort={setSort} />
              <SortableTh label="Shares" sortKey="shares" sort={sort} setSort={setSort} />
              <SortableTh label="ER" sortKey="engagement_rate" sort={sort} setSort={setSort} />
              <SortableTh label="Tanggal" sortKey="posted_at" sort={sort} setSort={setSort} />
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((p) => {
              const link = buildVideoLink(p.platform, p.author, p.post_id);
              return (
                <tr key={p.id} className="data-row" onClick={() => setSelectedPost(p)}>
                  <td className="creator-cell">{p.author || '—'}</td>
                  <td className="caption-cell">{truncate(p.caption || '(tanpa caption)', 40)}</td>
                  <td>
                    <span className="platform-tag">{p.platform}</span>
                  </td>
                  <td>{formatNum(p.views)}</td>
                  <td>{formatNum(p.likes)}</td>
                  <td>{formatNum(p.comments_count)}</td>
                  <td>{formatNum(p.shares)}</td>
                  <td>{p.engagement_rate >= 8 ? <span className="er-badge">{p.engagement_rate.toFixed(2)}%</span> : `${(p.engagement_rate ?? 0).toFixed(2)}%`}</td>
                  <td className="date-cell">{p.posted_at ? new Date(p.posted_at).toLocaleDateString('id-ID') : '—'}</td>
                  <td>
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        ↗ Lihat
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} totalRows={filtered.length} pageSize={pageSize} />

      <DetailPanel post={selectedPost} linkedComments={linkedComments} onClose={() => setSelectedPost(null)} />

      <TableStyles />
    </div>
  );
}

// ── Komentar Tab ─────────────────────────────────────────────────────────
function KomentarTable({ comments }) {
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('all');
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [sort, setSortState] = useState({ key: 'commented_at', dir: 'desc' });

  const platformOptions = useMemo(() => [...new Set(comments.map((c) => c.platform).filter(Boolean))], [comments]);

  function setSort(key) {
    setSortState((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }));
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let base = comments;
    if (platform !== 'all') base = base.filter((c) => c.platform === platform);
    if (q) base = base.filter((c) => (c.content ?? '').toLowerCase().includes(q) || (c.author ?? '').toLowerCase().includes(q));
    return sortData(base, sort.key, sort.dir);
  }, [comments, search, platform, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  function handleExport() {
    downloadCsv(
      'komentar.csv',
      filtered.map((c) => ({
        creator: c.author,
        komentar: c.content,
        platform: c.platform,
        likes: c.like_count,
        tanggal: c.commented_at ? new Date(c.commented_at).toLocaleString('id-ID') : '',
      })),
      [
        { key: 'creator', label: 'Creator' },
        { key: 'komentar', label: 'Komentar' },
        { key: 'platform', label: 'Platform' },
        { key: 'likes', label: 'Likes' },
        { key: 'tanggal', label: 'Tanggal' },
      ]
    );
  }

  if (comments.length === 0) {
    return <EmptyState text="Belum ada komentar yang terkumpul untuk brand ini." />;
  }

  return (
    <div className="video-table">
      <TableControls
        search={search}
        setSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        platform={platform}
        setPlatform={(v) => {
          setPlatform(v);
          setPage(1);
        }}
        platformOptions={platformOptions}
        pageSize={pageSize}
        setPageSize={(v) => {
          setPageSize(v);
          setPage(1);
        }}
        onExport={handleExport}
        exportLabel={`Export CSV (${filtered.length})`}
      />

      <div className="table-scroll">
        <table>
          <colgroup>
            <col style={{ width: '14%' }} />
            <col style={{ width: '38%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '16%' }} />
          </colgroup>
          <thead>
            <tr>
              <SortableTh label="Creator" sortKey="author" sort={sort} setSort={setSort} />
              <th>Komentar</th>
              <SortableTh label="Platform" sortKey="platform" sort={sort} setSort={setSort} />
              <SortableTh label="Likes" sortKey="like_count" sort={sort} setSort={setSort} />
              <SortableTh label="Sentimen" sortKey="sentiment" sort={sort} setSort={setSort} />
              <SortableTh label="Tanggal" sortKey="commented_at" sort={sort} setSort={setSort} />
            </tr>
          </thead>
          <tbody>
            {pageRows.map((c) => (
              <tr key={c.id} className="data-row-static">
                <td className="creator-cell">{c.author || '—'}</td>
                <td className="caption-cell">{truncate(c.content || '', 60)}</td>
                <td>
                  <span className="platform-tag">{c.platform}</span>
                </td>
                <td>{formatNum(c.like_count)}</td>
                <td>
                  {c.sentiment ? (
                    <span className="sentiment-cell-badge" style={sentimentCellStyle(c.sentiment)}>
                      {sentimentCellLabel(c.sentiment)}
                    </span>
                  ) : (
                    <span className="no-sentiment">—</span>
                  )}
                </td>
                <td className="date-cell">{c.commented_at ? new Date(c.commented_at).toLocaleDateString('id-ID') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} totalRows={filtered.length} pageSize={pageSize} />

      <TableStyles />
    </div>
  );
}

function TableStyles() {
  return (
    <style jsx>{`
      .table-scroll {
        overflow-x: auto;
        border: 1px solid var(--line);
        border-radius: 12px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 13px;
        min-width: 780px;
        background: var(--white);
      }
      th {
        text-align: left;
        padding: 12px 14px;
        background: var(--cream);
        color: var(--navy);
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        border-bottom: 2px solid var(--gold);
      }
      th:hover { color: var(--gold); }
      th.active-sort { color: var(--gold); }
      td {
        text-align: left;
        padding: 12px 14px;
        vertical-align: middle;
        overflow: hidden;
        white-space: nowrap;
        border-bottom: 1px solid var(--line);
      }
      .data-row { cursor: pointer; transition: background 0.15s ease; }
      .data-row:nth-child(even) { background: #FBF8EF; }
      .data-row:hover, .data-row:nth-child(even):hover { background: #FFF1C4 !important; }
      .data-row-static:nth-child(even) { background: #FBF8EF; }
      .data-row-static:hover, .data-row-static:nth-child(even):hover { background: #FFF1C4 !important; }
      .creator-cell { color: var(--ink); font-weight: 500; }
      .caption-cell { color: var(--ink); }
      .platform-tag {
        font-size: 10px;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--brown);
        background: var(--cream);
        padding: 3px 9px;
        border-radius: 999px;
      }
      .date-cell { color: var(--brown); }
      .er-badge {
        display: inline-block;
        background: #E1F5EE;
        color: #0F6E5C;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 12px;
      }
      .link-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        color: var(--navy);
        font-weight: 600;
        text-decoration: none;
        font-size: 12px;
        border: 1px solid var(--line);
        padding: 5px 12px;
        border-radius: 8px;
        background: var(--white);
      }
      .link-btn:hover { border-color: var(--navy); background: var(--cream); }
    `}</style>
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

const SENTIMENT_STYLES = {
  positive: { background: '#E1F5EE', color: '#0F6E5C' },
  negative: { background: '#FAECE7', color: '#993C1D' },
  neutral: { background: '#E8EDF7', color: '#223A78' },
  sarcasm: { background: '#FBF3DC', color: '#8C6D0A' },
  spam: { background: '#F1ECE3', color: '#5E5239' },
};
const SENTIMENT_LABELS = { positive: 'Positif', negative: 'Negatif', neutral: 'Netral', sarcasm: 'Sarkasme', spam: 'Spam' };

function sentimentCellStyle(sentiment) {
  const s = SENTIMENT_STYLES[sentiment] ?? SENTIMENT_STYLES.neutral;
  return { background: s.background, color: s.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 };
}
function sentimentCellLabel(sentiment) {
  return SENTIMENT_LABELS[sentiment] ?? sentiment;
}

function erClass(er) {
  if (er == null) return '';
  if (er >= 8) return 'er-high';
  if (er >= 3) return 'er-mid';
  return '';
}

function formatNum(n) {
  if (n == null) return '0';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'jt';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'rb';
  return String(n);
}

function truncate(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}
