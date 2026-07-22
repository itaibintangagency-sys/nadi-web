import { SkeletonPage, SkeletonBlock, SkeletonTable } from '@/components/Skeleton';

export default function Loading() {
  return (
    <SkeletonPage>
      <SkeletonBlock width={200} height={30} style={{ marginBottom: 8 }} />
      <SkeletonBlock width={320} height={14} style={{ marginBottom: 24 }} />
      <SkeletonTable rows={4} />
    </SkeletonPage>
  );
}
