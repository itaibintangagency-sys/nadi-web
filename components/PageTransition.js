'use client';

import { usePathname } from 'next/navigation';

export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition">
      {children}
      <style jsx>{`
        .page-transition {
          animation: pageIn 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes pageIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-transition {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
