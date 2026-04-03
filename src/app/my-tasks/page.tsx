// My Tasks page with mock table content
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@/components/Table';
import { Badge, type BadgeColor } from 'usds';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAuth } from '@/contexts/AuthContext';

export type TaskDisplayRow = {
  id: number;
  taskName: string;
  permitNumber: string;
  statusKey: 'pending' | 'completed' | 'rejected';
  updatedLabel: string;
};

const TASK_MOCK_ROWS: TaskDisplayRow[] = [
  {
    id: 1,
    taskName: 'Review Application Documents',
    permitNumber: 'C910043198',
    statusKey: 'pending',
    updatedLabel: 'Mar 12, 2026', // Static string
  },
  {
    id: 2,
    taskName: 'Approve Permit',
    permitNumber: 'C710043238',
    statusKey: 'completed',
    updatedLabel: 'Mar 10, 2026', // Static string
  },
  {
    id: 3,
    taskName: 'Send Notification',
    permitNumber: 'C710043197',
    statusKey: 'rejected',
    updatedLabel: 'Mar 8, 2026', // Static string
  },
];

function getTaskStatusMeta(status: string): { label: string; badgeColor: BadgeColor } {
  if (status === 'completed') return { label: 'COMPLETED', badgeColor: 'green' };
  if (status === 'rejected') return { label: 'REJECTED', badgeColor: 'red' };
  return { label: 'PENDING', badgeColor: 'blue' };
}

export default function MyTasksPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.replace('/login');
  }, [token, router]);

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
      <div className="w-full flex flex-col gap-[var(--space-lg)]">
        <h6 className="type-heading-h6">My Tasks</h6>
        <div className="overflow-x-auto" style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <table className="table min-w-[760px]">
            <thead>
              <tr>
                <th className="w-auto">TASK NAME</th>
                <th className="w-32">PERMIT #</th>
                <th className="w-32">STATUS</th>
                <th className="w-32">UPDATED</th>
              </tr>
            </thead>
            <tbody>
              {TASK_MOCK_ROWS.map((row) => (
                <tr key={row.id}>
                  <td>{row.taskName}</td>
                  <td>{row.permitNumber}</td>
                  <td>
                    {(() => {
                      const statusMeta = getTaskStatusMeta(row.statusKey);
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
        <p className="type-body-sm" style={{ color: 'var(--color-text-placeholder)' }}>
          Showing mock data for tasks.
        </p>
      </div>
    </WorkspaceShell>
  );
}
