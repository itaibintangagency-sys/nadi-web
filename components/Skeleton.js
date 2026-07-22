'use client';

// components/Skeleton.js
// Komponen dasar shimmer/skeleton — dipakai di semua file loading.js
// supaya konsisten, bukan blank putih pas data lagi di-fetch.

export function SkeletonBlock({ width = '100%', height = 16, radius = 8, style = {} }) {
  return (
    <div
      className="skeleton-block"
      style={{ width, height, borderRadius: radius, ...style }}
    >
      <style jsx>{`
        .skeleton-block {
          background: linear-gradient(90deg, var(--cream) 25%, #FFF6E0 37%, var(--cream) 63%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
        }
        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-block { animation: none; background: var(--cream); }
        }
      `}</style>
    </div>
  );
}

export function SkeletonCardGrid({ count = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <SkeletonBlock width={60} height={20} radius={999} style={{ marginBottom: 12 }} />
          <SkeletonBlock width="70%" height={20} style={{ marginBottom: 8 }} />
          <SkeletonBlock width="50%" height={14} style={{ marginBottom: 16 }} />
          <SkeletonBlock height={60} radius={10} />
        </div>
      ))}
      <style jsx>{`
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .skeleton-card {
          background: var(--white);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}

export function SkeletonTable({ rows = 6 }) {
  return (
    <div className="skeleton-table">
      <SkeletonBlock height={44} radius={10} style={{ marginBottom: 12 }} />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonBlock key={i} height={36} radius={8} style={{ marginBottom: 8 }} />
      ))}
      <style jsx>{`
        .skeleton-table { width: 100%; }
      `}</style>
    </div>
  );
}

export function SkeletonPage({ children }) {
  return (
    <div className="skeleton-page">
      {children}
      <style jsx>{`
        .skeleton-page { padding: 32px; max-width: 1100px; margin: 0 auto; }
      `}</style>
    </div>
  );
}
