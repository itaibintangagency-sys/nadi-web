'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

function extractHashtags(text) {
  if (!text) return [];
  const matches = text.match(/#[\p{L}\p{N}_]+/gu) ?? [];
  return [...new Set(matches.map((h) => h.toLowerCase()))];
}

export default function ExportPanel({ brands }) {
  const supabase = createClient();
  const [brandId, setBrandId] = useState(brands[0]?.id ?? '');
  const [dataType, setDataType] = useState('video'); // 'video' | 'komentar' | 'hashtag'
  const [hashtagSource, setHashtagSource] = useState('video'); // 'video' | 'komentar' — cuma relevan kalau dataType === 'hashtag'
  const [platform, setPlatform] = useState('all'); // 'all' | 'tiktok' | 'youtube' | 'instagram'
  const [count, setCount] = useState(null);
  const [hashtagRows, setHashtagRows] = useState([]);
  const [loadingCount, setLoadingCount] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!brandId) return;
    let cancelled = false;

    async function loadCount() {
      setLoadingCount(true);

      if (dataType === 'hashtag') {
        // Hashtag itu hasil agregasi, bukan baris mentah — perlu fetch penuh
        // dulu baru dihitung jumlah hashtag uniknya, hasilnya di-cache untuk
        // dipakai langsung waktu download (tidak fetch dua kali).
        const table = hashtagSource === 'video' ? 'raw_posts' : 'raw_comments';
        const columns = hashtagSource === 'video' ? 'caption, hashtags, views, likes, platform' : 'content, like_count, platform';
        let query = supabase.from(table).select(columns).eq('brand_id', brandId);
        if (platform !== 'all') query = query.eq('platform', platform);
        const { data } = await query;

        const map = {};
        if (hashtagSource === 'video') {
          for (const p of data ?? []) {
            const tags = p.hashtags?.length > 0 ? p.hashtags.map((h) => (h.startsWith('#') ? h.toLowerCase() : `#${h.toLowerCase()}`)) : extractHashtags(p.caption);
            for (const tag of [...new Set(tags)]) {
              map[tag] = map[tag] || { hashtag: tag, video: 0, views: 0, likes: 0 };
              map[tag].video += 1;
              map[tag].views += p.views || 0;
              map[tag].likes += p.likes || 0;
            }
          }
        } else {
          for (const c of data ?? []) {
            const tags = extractHashtags(c.content);
            for (const tag of tags) {
              map[tag] = map[tag] || { hashtag: tag, komentar: 0, likes: 0 };
              map[tag].komentar += 1;
              map[tag].likes += c.like_count || 0;
            }
          }
        }
        const rows = Object.values(map).sort((a, b) => b.likes - a.likes);

        if (!cancelled) {
          setHashtagRows(rows);
          setCount(rows.length);
          setLoadingCount(false);
        }
        return;
      }

      const table = dataType === 'video' ? 'raw_posts' : 'raw_comments';
      let query = supabase.from(table).select('id', { count: 'exact', head: true }).eq('brand_id', brandId);
      if (platform !== 'all') query = query.eq('platform', platform);
      const { count: c } = await query;
      if (!cancelled) {
        setCount(c ?? 0);
        setLoadingCount(false);
      }
    }
    loadCount();

    return () => {
      cancelled = true;
    };
  }, [brandId, dataType, hashtagSource, platform]);

  async function handleDownload() {
    setDownloading(true);
    const brandName = brands.find((b) => b.id === brandId)?.name ?? 'brand';
    const platformSuffix = platform !== 'all' ? `-${platform}` : '';

    if (dataType === 'hashtag') {
      const headers =
        hashtagSource === 'video'
          ? [
              { key: 'hashtag', label: 'Hashtag' },
              { key: 'video', label: 'Jumlah Video' },
              { key: 'views', label: 'Total Views' },
              { key: 'likes', label: 'Total Likes' },
            ]
          : [
              { key: 'hashtag', label: 'Hashtag' },
              { key: 'komentar', label: 'Jumlah Komentar' },
              { key: 'likes', label: 'Total Likes' },
            ];
      downloadCsv(`${slug(brandName)}-hashtag-${hashtagSource}${platformSuffix}.csv`, hashtagRows, headers);
      setDownloading(false);
      return;
    }

    if (dataType === 'video') {
      let query = supabase
        .from('raw_posts')
        .select('author, caption, platform, views, likes, comments_count, shares, engagement_rate, posted_at')
        .eq('brand_id', brandId)
        .order('posted_at', { ascending: false });
      if (platform !== 'all') query = query.eq('platform', platform);
      const { data } = await query;

      downloadCsv(`${slug(brandName)}-video${platformSuffix}.csv`, data ?? [], [
        { key: 'author', label: 'Creator' },
        { key: 'caption', label: 'Caption' },
        { key: 'platform', label: 'Platform' },
        { key: 'views', label: 'Views' },
        { key: 'likes', label: 'Likes' },
        { key: 'comments_count', label: 'Comments' },
        { key: 'shares', label: 'Shares' },
        { key: 'engagement_rate', label: 'ER' },
        { key: 'posted_at', label: 'Tanggal' },
      ]);
    } else {
      let query = supabase
        .from('raw_comments')
        .select('author, content, platform, like_count, commented_at')
        .eq('brand_id', brandId)
        .order('commented_at', { ascending: false });
      if (platform !== 'all') query = query.eq('platform', platform);
      const { data } = await query;

      downloadCsv(`${slug(brandName)}-komentar${platformSuffix}.csv`, data ?? [], [
        { key: 'author', label: 'Creator' },
        { key: 'content', label: 'Komentar' },
        { key: 'platform', label: 'Platform' },
        { key: 'like_count', label: 'Likes' },
        { key: 'commented_at', label: 'Tanggal' },
      ]);
    }

    setDownloading(false);
  }

  if (brands.length === 0) {
    return <p className="empty-hint">Belum ada brand yang bisa kamu akses.</p>;
  }

  return (
    <div className="export-panel">
      <div className="field">
        <label>Brand</label>
        <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="input-field">
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Tipe Data</label>
        <div className="type-toggle">
          <button type="button" className={dataType === 'video' ? 'active' : ''} onClick={() => setDataType('video')}>
            Video
          </button>
          <button type="button" className={dataType === 'komentar' ? 'active' : ''} onClick={() => setDataType('komentar')}>
            Komentar
          </button>
          <button type="button" className={dataType === 'hashtag' ? 'active' : ''} onClick={() => setDataType('hashtag')}>
            Hashtag
          </button>
        </div>
      </div>

      {dataType === 'hashtag' && (
        <div className="field">
          <label>Sumber Hashtag</label>
          <div className="type-toggle">
            <button type="button" className={hashtagSource === 'video' ? 'active' : ''} onClick={() => setHashtagSource('video')}>
              Caption Video
            </button>
            <button type="button" className={hashtagSource === 'komentar' ? 'active' : ''} onClick={() => setHashtagSource('komentar')}>
              Komentar
            </button>
          </div>
        </div>
      )}

      <div className="field">
        <label>Platform</label>
        <div className="type-toggle">
          {['all', 'tiktok', 'youtube', 'instagram'].map((p) => (
            <button key={p} type="button" className={platform === p ? 'active' : ''} onClick={() => setPlatform(p)}>
              {p === 'all' ? 'Semua' : p}
            </button>
          ))}
        </div>
      </div>

      <div className="preview-box">
        <span className="preview-label">{dataType === 'hashtag' ? 'Hashtag unik siap diunduh' : 'Baris siap diunduh'}</span>
        <span className="preview-count">{loadingCount ? '...' : count ?? 0}</span>
      </div>

      <button onClick={handleDownload} disabled={downloading || loadingCount || (count ?? 0) === 0} className="btn-primary download-btn">
        {downloading ? 'Menyiapkan file...' : `↓ Download CSV (${count ?? 0} baris)`}
      </button>

      <style jsx>{`
        .export-panel {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .field { display: flex; flex-direction: column; gap: 6px; }
        label { font-size: 13px; font-weight: 600; color: var(--brown); }
        select.input-field { width: 100%; }

        .type-toggle { display: flex; gap: 8px; flex-wrap: wrap; }
        .type-toggle button {
          padding: 9px 18px;
          border-radius: 999px;
          border: 1px solid var(--navy);
          background: var(--white);
          color: var(--navy);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-transform: capitalize;
        }
        .type-toggle button.active { background: var(--navy); color: var(--white); }

        .preview-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--cream);
          border-radius: 10px;
          padding: 14px 18px;
        }
        .preview-label { font-size: 13px; color: var(--brown); }
        .preview-count { font-size: 22px; font-weight: 700; color: var(--navy); font-family: 'Fraunces', serif; }

        .download-btn { width: 100%; text-align: center; }
        .empty-hint { font-size: 13px; color: var(--brown); }
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

function slug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
