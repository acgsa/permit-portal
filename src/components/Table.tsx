// Overridden Table component: MyApplicationsTable logic
'use client';
import { Badge, type BadgeColor } from 'usds';
import Link from 'next/link';

export type ApplicantDisplayRow = {
  id: number;
  title: string;
  permitNumber: string;
  statusKey: 'in_review' | 'in_progress' | 'rejected' | 'approved';
  updatedLabel: string;
};

function getApplicantStatusMeta(status: string): { label: string; badgeColor: BadgeColor } {
  if (status === 'approved' || status === 'completed') {
    return { label: 'APPROVED', badgeColor: 'green' };
  }
  if (status === 'rejected' || status === 'error') {
    return { label: 'REJECTED', badgeColor: 'red' };
  }
  if (status === 'in_review' || status === 'running') {
    return { label: 'IN REVIEW', badgeColor: 'gold' };
  }
  return { label: 'IN PROGRESS', badgeColor: 'steel' };
}

export function Table({ rows = [], showMockNotice }: {
  rows?: ApplicantDisplayRow[];
  showMockNotice?: boolean;
}) {
  return (
    <div className="w-full flex flex-col gap-[var(--space-lg)]">
      <h6 className="type-heading-h6">My Applications</h6>
      <div style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
        <table className="table min-w-[760px]">
          <thead>
            <tr>
              <th className="w-auto">TITLE</th>
              <th className="w-32">PERMIT #</th>
              <th className="w-32">STATUS</th>
              <th className="w-32">UPDATED</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <Link
                    href={`/applications/${row.permitNumber}`}
                    className="text-blue-400 hover:underline focus:underline focus:outline-none"
                  >
                    {row.title}
                  </Link>
                </td>
                <td>{row.permitNumber}</td>
                <td>
                  {(() => {
                    const statusMeta = getApplicantStatusMeta(row.statusKey);
                    return (
                      <Badge color={statusMeta.badgeColor} size="sm">
                        {statusMeta.label}
                      </Badge>
                    );
                  })()}
                </td>
                <td>{row.updatedLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showMockNotice ? (
        <p className="type-body-sm" style={{ color: 'var(--color-text-placeholder)' }}>
          Showing mock data while application data is unavailable.
        </p>
      ) : null}
    </div>
  );
}
