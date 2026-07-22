import { SkeletonPage, SkeletonBlock, SkeletonCardGrid } from '@/components/Skeleton';

export default function Loading() {
  return (
    <SkeletonPage>
      <SkeletonBlock width={100} height={12} style={{ marginBottom: 12 }} />
      <SkeletonBlock width={200} height={30} style={{ marginBottom: 24 }} />
      <SkeletonCardGrid count={6} />
    </SkeletonPage>
  );
}
