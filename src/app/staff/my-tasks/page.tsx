'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge, type BadgeColor, Button } from 'usds';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { AnimatedCard, AnimatedTableRow } from '@/components/motion';
import { useAuth } from '@/contexts/AuthContext';
import { STAFF_TASK_MOCK_ROWS, type StaffTaskRow } from '@/lib/mockFederalPortalData';

type FilterKey = 'all' | 'in-progress' | 'not-started' | 'complete' | 'overdue';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'not-started', label: 'Not Started' },
  { key: 'complete', label: 'Complete' },
  { key: 'overdue', label: 'Overdue' },
];

function getTaskStatusMeta(status: string): { label: string; badgeColor: BadgeColor } {
  if (status === 'complete') return { label: 'COMPLETE', badgeColor: 'green' };
  if (status === 'in-progress') return { label: 'IN PROGRESS', badgeColor: 'blue' };
  if (status === 'overdue') return { label: 'OVERDUE', badgeColor: 'red' };
  return { label: 'NOT STARTED', badgeColor: 'steel' };
}

export default function StaffMyTasksPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>('all');

  useEffect(() => {
    if (!token) router.replace('/f/staff');
  }, [token, router]);

  if (!token) return null;

  const filtered =
    filter === 'all' ? STAFF_TASK_MOCK_ROWS : STAFF_TASK_MOCK_ROWS.filter((r) => r.statusKey === filter);

  return (
    <WorkspaceShell
      role={user?.role}
      userSub={user?.sub}
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      <PortalPageScaffold title="">
        <div className="w-full flex flex-col gap-[var(--space-lg)]">
          <h6 className="type-heading-h6">My Tasks</h6>

          {/* Filter pills */}
          <div className="flex items-center gap-[var(--space-xs)]">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`inline-flex items-center rounded-full type-body-xs font-semibold transition-colors ${
                  filter === f.key
                    ? 'bg-[var(--color-text)] text-[var(--color-bg)]'
                    : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-body)] hover:bg-[var(--color-border)]'
                }`}
                style={{ paddingInline: 'var(--space-sm)', paddingBlock: 'var(--space-2xs)' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <AnimatedCard>
            {/* Desktop table */}
            <div className="hidden md:block">
              <section
                className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]"
                style={{ background: 'var(--color-bg)' }}
              >
                <div className="overflow-x-auto">
                  <table className="table min-w-[820px]">
                    <thead>
                      <tr>
                        <th className="w-auto">TASK NAME</th>
                        <th className="w-36">PID</th>
                        <th className="w-36">APPLICANT</th>
                        <th className="w-32">STATUS</th>
                        <th className="w-32">UPDATED</th>
                        <th className="w-28">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((row, idx) => {
                        const statusMeta = getTaskStatusMeta(row.statusKey);
                        return (
                          <AnimatedTableRow key={row.id} index={idx}>
                            <td className="type-body-sm">
                              <Link
                                href={`/f/projects/${row.projectId}`}
                                className="text-[var(--color-text-link)] hover:text-[var(--color-text-link-hover)] hover:underline focus:underline focus:outline-none"
                              >
                                {row.taskName}
                              </Link>
                            </td>
                            <td className="type-body-xs font-mono text-[var(--color-text-disabled)]">{row.applicationId}</td>
                            <td className="type-body-xs text-[var(--color-text-body)]">{row.applicantName}</td>
                            <td>
                              <Badge color={statusMeta.badgeColor} size="sm">{statusMeta.label}</Badge>
                            </td>
                            <td className="type-body-sm">{row.updatedLabel}</td>
                            <td>
                              {(row.statusKey === 'in-progress' || row.statusKey === 'overdue') && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => router.push(`/f/projects/${row.projectId}`)}
                                >
                                  Continue
                                </Button>
                              )}
                            </td>
                          </AnimatedTableRow>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-[var(--space-sm)] md:hidden">
              {filtered.map((row) => {
                const statusMeta = getTaskStatusMeta(row.statusKey);
                return (
                  <div
                    key={row.id}
                    className="flex flex-col gap-[var(--space-sm)] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)]"
                    style={{ padding: 'var(--space-md)' }}
                  >
                    <div className="flex items-start justify-between gap-[var(--space-sm)]">
                      <div className="flex-1">
                        <Link
                          href={`/f/projects/${row.projectId}`}
                          className="type-body-sm font-medium text-[var(--color-text-link)] hover:underline"
                        >
                          {row.taskName}
                        </Link>
                        <p className="type-body-xs text-[var(--color-text-disabled)]">
                          {row.applicationId} · {row.applicantName}
                        </p>
                      </div>
                      <Badge color={statusMeta.badgeColor} size="sm">{statusMeta.label}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="type-body-xs text-[var(--color-text-disabled)]">{row.updatedLabel}</p>
                      {(row.statusKey === 'in-progress' || row.statusKey === 'overdue') && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => router.push(`/f/projects/${row.projectId}`)}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </AnimatedCard>

          <p className="type-body-xs text-[var(--color-text-disabled)]">
            Showing {filtered.length} of {STAFF_TASK_MOCK_ROWS.length} tasks
          </p>
        </div>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
