// Reusable MyApplicationsTable component
'use client';

import { Table, type ApplicantDisplayRow } from '@/components/Table';

export function MyApplicationsTable({ rows, showMockNotice }: {
  rows: ApplicantDisplayRow[];
  showMockNotice?: boolean;
}) {
  return <Table rows={rows} showMockNotice={showMockNotice} />;
}
