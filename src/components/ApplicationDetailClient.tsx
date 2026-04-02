'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Clock3, Download, ExternalLink, FileText, MoveLeft } from 'lucide-react';
import { Badge, type BadgeColor } from 'usds';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { LucideIcon } from '@/components/LucideIcon';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';

type Props = {
  applicationId: string;
};

const STATUS_STEPS = [
  'Submission',
  'Initial Review',
  'Fee Estimation',
  'Request for Info',
  'Field Review',
  'Payment',
  'Final Approval',
];

const TASK_ROWS = [
  { title: 'Submit Final Payment', dueDate: 'May 12, 2025', status: 'PENDING', updated: 'May 12, 2025' },
  { title: 'Respond to Request for More Information', dueDate: 'May 12, 2025', status: 'DRAFT', updated: 'May 12, 2025' },
  { title: 'Respond to Fee Estimation', dueDate: 'May 12, 2025', status: 'COMPLETED', updated: 'May 12, 2025' },
  { title: 'Respond to Request for More Information', dueDate: 'May 12, 2025', status: 'COMPLETED', updated: 'May 12, 2025' },
  { title: 'Submit Permit Application', dueDate: 'May 12, 2025', status: 'COMPLETED', updated: 'May 12, 2025' },
];

function getTaskStatusMeta(status: string): { label: string; badgeColor: BadgeColor } {
  if (status === 'COMPLETED') return { label: 'COMPLETED', badgeColor: 'green' };
  if (status === 'DRAFT') return { label: 'DRAFT', badgeColor: 'steel' };
  return { label: 'PENDING', badgeColor: 'gold' };
}

export default function ApplicationDetailClient({ applicationId }: Props) {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const applicationTitle = 'Eagle Exhibition Toms River Avian Care Don Bonica';
  const completedSteps = 3;
  const getStepState = (idx: number): 'completed' | 'upcoming' => (idx < completedSteps ? 'completed' : 'upcoming');

  if (!token) return null;

  return (
    <WorkspaceShell
      role={user?.role}
      userSub={user?.sub}
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      <PortalPageScaffold>
        <div className="flex flex-col" style={{ gap: 'var(--space-md, 16px)' }}>
          <div>
            <Link href="/my-applications" className="inline-flex items-center gap-2 type-body-sm text-[var(--color-text-body)] hover:text-[var(--color-text)]">
              <LucideIcon icon={MoveLeft} size={16} />
              My Applications
            </Link>
          </div>

          <div className="flex items-end justify-between gap-[var(--space-sm)]">
            <div className="flex flex-col gap-[var(--space-2xs)]">
              <h1 className="type-heading-h4 text-[var(--color-text)]">{applicationTitle}</h1>
              <p className="type-body-sm text-[var(--color-text-disabled)]">#{applicationId}</p>
            </div>
            <div className="flex items-center gap-[var(--space-sm)] text-[var(--color-text-body)]">
              <LucideIcon icon={Download} size={16} />
              <LucideIcon icon={FileText} size={16} />
              <LucideIcon icon={ExternalLink} size={16} />
            </div>
          </div>

          <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg)' }}>
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Status</th>
                </tr>
              </thead>
            </table>

            <div className="overflow-x-auto px-[var(--space-md)]" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
              <div className="min-w-[760px]">
                <div className="flex items-start">
                  {STATUS_STEPS.map((step, idx) => {
                    const state = getStepState(idx);
                    const isCompleted = state === 'completed';
                    return (
                      <div key={step} className="flex flex-1 items-start">
                        <div className="flex w-full flex-col items-center">
                          <span
                            className="flex h-11 w-11 items-center justify-center rounded-full border text-base font-semibold"
                            style={{
                              borderColor: isCompleted ? 'var(--green-500, #2e9f60)' : 'var(--color-border-emphasis)',
                              background: isCompleted ? 'var(--green-500, #2e9f60)' : 'transparent',
                              color: isCompleted ? 'var(--color-text-buttons-primary, #fff)' : 'var(--color-text-disabled)',
                            }}
                            aria-hidden="true"
                          >
                            {isCompleted ? <LucideIcon icon={Check} size={20} /> : <LucideIcon icon={Clock3} size={16} />}
                          </span>
                          <p className="mt-[var(--space-sm)] text-center type-body-sm text-[var(--color-text)]">{step}</p>
                        </div>

                        {idx < STATUS_STEPS.length - 1 ? (
                          <span
                            className="mx-[var(--space-2xs)] mt-[22px] h-[2px] flex-1 rounded-full"
                            style={{
                              background:
                                idx < completedSteps - 1 ? 'var(--green-500, #2e9f60)' : 'var(--color-border)',
                            }}
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg)' }}>
            <div className="overflow-x-auto">
              <table className="table min-w-[780px]">
                <thead>
                  <tr>
                    <th className="w-auto">My Tasks</th>
                    <th className="w-40">Due Date</th>
                    <th className="w-28">Status</th>
                    <th className="w-32">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {TASK_ROWS.map((task, idx) => {
                    const statusMeta = getTaskStatusMeta(task.status);
                    return (
                      <tr key={`${task.title}-${idx}`}>
                        <td className="type-body-sm">{task.title}</td>
                        <td className="type-body-sm">{task.dueDate}</td>
                        <td>
                          <Badge color={statusMeta.badgeColor} size="sm">
                            {statusMeta.label}
                          </Badge>
                        </td>
                        <td className="type-body-sm">{task.updated}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-[var(--space-md)] py-[var(--space-sm)] type-body-xs text-[var(--color-text-disabled)]">
              Showing 1-5 of 5 items
            </div>
          </section>
        </div>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
