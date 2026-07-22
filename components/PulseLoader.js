'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/site-config';

export default function PulseLoader() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Bukan progress asli (tidak ada cara tahu progress fetch sungguhan
    // dari sisi ini) — cuma animasi angka naik yang melambat, biar terasa
    // "jalan" tanpa klaim akurasi yang salah. Berhenti di 96%, biar tidak
    // pernah keliru bilang "100%" padahal belum tentu selesai.
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 96) return prev;
        const step = prev < 60 ? 4 : prev < 85 ? 2 : 0.5;
        return Math.min(96, prev + step);
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pulse-loader">
      <svg viewBox="0 0 300 70" className="pulse-svg">
        <polyline
          className="pulse-line-bg"
          points="0,35 40,35 55,35 65,12 75,58 85,35 120,35 155,35 170,35 180,8 190,62 200,35 240,35 270,35 285,35 292,18 300,50"
        />
        <polyline
          className="pulse-line"
          points="0,35 40,35 55,35 65,12 75,58 85,35 120,35 155,35 170,35 180,8 190,62 200,35 240,35 270,35 285,35 292,18 300,50"
        />
      </svg>
      <p className="pulse-brand">{siteConfig.productName}</p>
      <p className="pulse-text">Loading... <span className="pulse-percent">{Math.round(percent)}%</span></p>

      <style jsx>{`
        .pulse-loader {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px;
        }
        .pulse-svg {
          width: 220px;
          height: 52px;
        }
        .pulse-line-bg {
          fill: none;
          stroke: var(--line);
          stroke-width: 2;
        }
        .pulse-line {
          fill: none;
          stroke: var(--gold);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 60 500;
          filter: drop-shadow(0 0 3px var(--gold));
          animation: flow-pulse 2.2s linear infinite;
        }
        @keyframes flow-pulse {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -560; }
        }
        .pulse-brand {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--navy);
          margin: 12px 0 2px;
        }
        .pulse-text {
          font-size: 13px;
          color: var(--brown);
          margin: 0;
        }
        .pulse-percent {
          font-weight: 700;
          color: var(--gold);
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse-line { animation: none; stroke-dasharray: none; }
        }
      `}</style>
    </div>
  );
}
