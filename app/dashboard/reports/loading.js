import { SkeletonPage, SkeletonBlock } from '@/components/Skeleton';

export default function Loading() {
  return (
    <SkeletonPage>
      <SkeletonBlock width={80} height={12} style={{ marginBottom: 12 }} />
      <SkeletonBlock width={220} height={30} style={{ marginBottom: 24 }} />
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonBlock key={i} height={70} radius={14} style={{ marginBottom: 12 }} />
      ))}
    </SkeletonPage>
  );
}
