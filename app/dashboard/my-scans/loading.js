import { SkeletonPage, SkeletonBlock, SkeletonCardGrid } from '@/components/Skeleton';

export default function Loading() {
  return (
    <SkeletonPage>
      <SkeletonBlock width={80} height={12} style={{ marginBottom: 12 }} />
      <SkeletonBlock width={200} height={30} style={{ marginBottom: 24 }} />
      <SkeletonCardGrid count={4} />
    </SkeletonPage>
  );
}
