import { SkeletonPage, SkeletonBlock, SkeletonTable } from '@/components/Skeleton';

export default function Loading() {
  return (
    <SkeletonPage>
      <SkeletonBlock width={140} height={12} style={{ marginBottom: 16 }} />
      <SkeletonBlock width={60} height={20} radius={999} style={{ marginBottom: 10 }} />
      <SkeletonBlock width={240} height={32} style={{ marginBottom: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} height={80} radius={14} />
        ))}
      </div>
      <SkeletonBlock width={280} height={36} style={{ marginBottom: 24 }} />
      <SkeletonTable rows={6} />
    </SkeletonPage>
  );
}
