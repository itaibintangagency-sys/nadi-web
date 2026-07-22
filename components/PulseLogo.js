'use client';

export default function PulseLogo({ size = 'default' }) {
  const isSmall = size === 'small';

  return (
    <div className={`pulse-logo ${isSmall ? 'small' : ''}`}>
      <svg viewBox="0 0 44 24" className="pulse-icon">
        <polyline
          className="pulse-icon-line"
          points="0,12 8,12 11,4 15,20 18,12 26,12 29,6 33,18 36,12 44,12"
        />
      </svg>
      <span className="pulse-wordmark">
        Nadi <span className="pulse-sub">- BIS</span>
      </span>

      <style jsx>{`
        .pulse-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pulse-icon {
          width: 30px;
          height: 18px;
          flex-shrink: 0;
        }
        .small .pulse-icon { width: 24px; height: 14px; }
        .pulse-icon-line {
          fill: none;
          stroke: var(--gold);
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 20 200;
          filter: drop-shadow(0 0 2px var(--gold));
          animation: pulse-flow 2.4s linear infinite;
        }
        @keyframes pulse-flow {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -220; }
        }
        .pulse-wordmark {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 19px;
          color: var(--cream);
          white-space: nowrap;
        }
        .small .pulse-wordmark { font-size: 16px; }
        .pulse-sub {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 12px;
          color: rgba(255, 239, 202, 0.6);
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse-icon-line { animation: none; }
        }
      `}</style>
    </div>
  );
}
