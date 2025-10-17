import { Badge } from '@mantine/core';
import type { ReviewStatus } from '@/types/manifest';

interface StatusBadgeProps {
  status: ReviewStatus;
}

const statusConfig: Record<ReviewStatus, { color: string; label: string }> = {
  approved: { color: 'green', label: 'Approved' },
  requires_review: { color: 'yellow', label: 'Requires Review' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.requires_review;
  return <Badge color={config.color}>{config.label}</Badge>;
}
