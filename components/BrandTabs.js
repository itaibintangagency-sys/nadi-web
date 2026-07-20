'use client';

import { Fragment, useMemo, useState } from 'react';

const PAGE_SIZE_OPTIONS = [10, 30, 50, 100, 300, 500];

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
        {active === 'video' && <VideoTable posts={posts} comments={comments} />}
        {active === 'komentar' && <KomentarTable comments={comments} />}
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

// ── Line chart: top 10 creator by total views, animated draw-in ─────────
function TopCreatorChart({ posts }) {
  const data = useMemo(() => {
    const byCreator = {};
    posts.forEach((p) => {
      const key = p.author || 'unknown';
      byCreator[key] = (byCreator[key] || 0) + (p.views || 0);
    });
    return Object.entries(byCreator)
      .map(([creator, views]) => ({ creator, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }, [posts]);

  if (data.length === 0) return null;

  const W = 640;
  const H = 260;
  const padLeft = 56;
  const padRight = 20;
  const padTop = 16;
  const padBottom = 36;
  const plotW = W - padLeft - padRight;
  const plotH = H - padTop - padBottom;
  const max = Math.max(...data.map((d) => d.views), 1);

  const points = data.map((d, i) => {
    const x = padLeft + (data.length === 1 ? plotW / 2 : (i * plotW) / (data.length - 1));
    const y = padTop + plotH - (d.views / max) * plotH;
    return { ...d, x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="chart-card">
      <h3>Top 10 Creator berdasarkan Views</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg">
        {gridLines.map((f) => {
          const y = padTop + plotH * (1 - f);
          return (
            <g key={f}>
              <line x1={padLeft} x2={W - padRight} y1={y} y2={y} className="grid-line" />
              <text x={padLeft - 10} y={y + 4} textAnchor="end" className="axis-label">
                {formatNum(Math.round(max * f))}
              </text>
            </g>
          );
        })}

        <path d={linePath} className="line-path" />

        {points.map((p) => (
          <g key={p.creator}>
            <circle cx={p.x} cy={p.y} r="4" className="dot" />
            <text x={p.x} y={H - 10} textAnchor="middle" className="x-label">
              {truncate(p.creator, 8)}
            </text>
          </g>
        ))}
      </svg>
      <style jsx>{`
        .chart-card {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 20px 20px 8px;
          margin-bottom: 28px;
        }
        h3 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--navy); margin: 0 0 12px; }
        .chart-svg { width: 100%; height: 240px; display: block; }
        :global(.grid-line) { stroke: var(--line); stroke-width: 1; }
        :global(.axis-label) { font-size: 10px; fill: var(--brown); }
        :global(.x-label) { font-size: 9px; fill: var(--brown); }
        :global(.line-path) {
          fill: none;
          stroke: var(--navy);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: draw 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        :global(.dot) {
          fill: var(--gold);
          stroke: var(--white);
          stroke-width: 1.5;
          opacity: 0;
          animation: dot-in 0.4s ease forwards 1.2s;
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes dot-in {
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.line-path) { animation: none; stroke-dashoffset: 0; }
          :global(.dot) { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── Shared control bar ───────────────────────────────────────────────────
function TableControls({ search, setSearch, pageSize, setPageSize, onExport, exportLabel }) {
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
        .controls-right { display: flex; gap: 8px; align-items: center; }
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

// ── Video Tab ────────────────────────────────────────────────────────────
function VideoTable({ posts, comments }) {
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => (p.caption ?? '').toLowerCase().includes(q) || (p.author ?? '').toLowerCase().includes(q));
  }, [posts, search]);

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

  return (
    <div className="video-table">
      <TopCreatorChart posts={posts} />

      <TableControls
        search={search}
        setSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
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
            <col style={{ width: '28%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '7%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Creator</th>
              <th>Caption</th>
              <th>Platform</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Shares</th>
              <th>ER</th>
              <th>Tanggal</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((p) => {
              const link = buildVideoLink(p.platform, p.author, p.post_id);
              const linkedComments = comments.filter((c) => c.post_ref === p.id);
              const isExpanded = expandedId === p.id;

              return (
                <Fragment key={p.id}>
                  <tr
                    className={`data-row ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  >
                    <td className="creator-cell">{p.author || '—'}</td>
                    <td className="caption-cell" title={p.caption}>
                      {p.caption || '(tanpa caption)'}
                    </td>
                    <td>
                      <span className="platform-tag">{p.platform}</span>
                    </td>
                    <td>{formatNum(p.views)}</td>
                    <td>{formatNum(p.likes)}</td>
                    <td>{formatNum(p.comments_count)}</td>
                    <td>{formatNum(p.shares)}</td>
                    <td className={erClass(p.engagement_rate)}>{(p.engagement_rate ?? 0).toFixed(2)}%</td>
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
                          Lihat ↗
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="detail-row">
                      <td colSpan={10}>
                        <div className="detail-panel">
                          <p className="detail-title">
                            Komentar untuk video ini {linkedComments.length > 0 && `(${linkedComments.length})`}
                          </p>
                          {linkedComments.length === 0 ? (
                            <p className="detail-empty">Belum ada komentar yang tertaut ke video ini.</p>
                          ) : (
                            <div className="detail-comments">
                              {linkedComments.map((c) => (
                                <div key={c.id} className="detail-comment">
                                  <span className="detail-comment-author">@{c.author || 'unknown'}</span>
                                  <span className="detail-comment-content">{c.content}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} totalRows={filtered.length} pageSize={pageSize} />

      <TableStyles />
    </div>
  );
}

// ── Komentar Tab ─────────────────────────────────────────────────────────
function KomentarTable({ comments }) {
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return comments;
    return comments.filter((c) => (c.content ?? '').toLowerCase().includes(q) || (c.author ?? '').toLowerCase().includes(q));
  }, [comments, search]);

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
            <col style={{ width: '18%' }} />
            <col style={{ width: '52%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Creator</th>
              <th>Komentar</th>
              <th>Platform</th>
              <th>Likes</th>
              <th>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((c) => (
              <tr key={c.id} className="data-row">
                <td className="creator-cell">{c.author || '—'}</td>
                <td className="caption-cell" title={c.content}>
                  {c.content}
                </td>
                <td>
                  <span className="platform-tag">{c.platform}</span>
                </td>
                <td>{formatNum(c.like_count)}</td>
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
        min-width: 760px;
      }
      th {
        text-align: left;
        padding: 12px 14px;
        background: var(--navy);
        color: var(--cream);
        font-size: 10.5px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-weight: 700;
      }
      td {
        text-align: left;
        padding: 12px 14px;
        border-bottom: 1px solid var(--line);
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .data-row { cursor: pointer; transition: background 0.15s ease; }
      .data-row:hover { background: #FCFAF3; }
      .data-row.expanded { background: var(--cream); }
      tbody tr:last-child td { border-bottom: none; }
      .creator-cell { color: var(--navy); font-weight: 600; }
      .caption-cell {
        color: var(--ink);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
      .date-cell { color: var(--brown); }
      .er-high { color: #0F6E5C; font-weight: 700; }
      .er-mid { color: var(--gold); font-weight: 600; }
      .link-btn {
        color: var(--navy);
        font-weight: 600;
        text-decoration: none;
        font-size: 12px;
        border: 1px solid var(--navy);
        padding: 4px 10px;
        border-radius: 999px;
      }
      .link-btn:hover { background: var(--navy); color: var(--white); }

      .detail-row td {
        white-space: normal;
        background: var(--cream);
        padding: 0;
      }
      .detail-panel { padding: 16px 20px; }
      .detail-title { font-size: 12px; font-weight: 700; color: var(--navy); margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.04em; }
      .detail-empty { font-size: 13px; color: var(--brown); margin: 0; }
      .detail-comments { display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto; }
      .detail-comment {
        background: var(--white);
        border-radius: 8px;
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      .detail-comment-author { font-size: 11px; font-weight: 700; color: var(--navy); }
      .detail-comment-content { font-size: 13px; color: var(--ink); white-space: normal; }
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
  return str.length > n ? str.slice(0, n) + '…' : str;
}
