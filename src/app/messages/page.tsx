// Messages page with mock table content
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, type BadgeColor } from 'usds';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAuth } from '@/contexts/AuthContext';

export type MessageDisplayRow = {
  id: number;
  subject: string;
  sender: string;
  statusKey: 'unread' | 'read' | 'archived';
  receivedLabel: string;
};

const MESSAGE_MOCK_ROWS: MessageDisplayRow[] = [
  {
    id: 1,
    subject: 'Permit Application Update',
    sender: 'Permit Office',
    statusKey: 'unread',
    receivedLabel: 'Mar 17, 2026', // Static string
  },
  {
    id: 2,
    subject: 'Document Required',
    sender: 'Support Team',
    statusKey: 'read',
    receivedLabel: 'Mar 15, 2026', // Static string
  },
  {
    id: 3,
    subject: 'Permit Approved',
    sender: 'Permit Office',
    statusKey: 'archived',
    receivedLabel: 'Mar 10, 2026', // Static string
  },
];

function getMessageStatusMeta(status: string): { label: string; badgeColor: BadgeColor } {
  if (status === 'read') return { label: 'READ', badgeColor: 'blue' };
  if (status === 'archived') return { label: 'ARCHIVED', badgeColor: 'steel' };
  return { label: 'UNREAD', badgeColor: 'red' };
}

export default function MessagesPage() {
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
        <h6 className="type-heading-h6">Messages</h6>

        {/* ── Desktop table ── */}
        <div className="hidden md:block">
          <div className="overflow-x-auto" style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
            <table className="table min-w-[760px]">
              <thead>
                <tr>
                  <th className="w-auto">SUBJECT</th>
                  <th className="w-32">SENDER</th>
                  <th className="w-32">STATUS</th>
                  <th className="w-32">RECEIVED</th>
                </tr>
              </thead>
              <tbody>
                {MESSAGE_MOCK_ROWS.map((row) => (
                  <tr key={row.id}>
                    <td>{row.subject}</td>
                    <td>{row.sender}</td>
                    <td>
                      {(() => {
                        const statusMeta = getMessageStatusMeta(row.statusKey);
                        return (
                          <Badge color={statusMeta.badgeColor} size="sm">
                            {statusMeta.label}
                          </Badge>
                        );
                      })()}
                    </td>
                    <td>{row.receivedLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Mobile cards ── */}
        <div className="flex flex-col gap-[var(--space-sm)] md:hidden">
          {MESSAGE_MOCK_ROWS.map((row) => {
            const statusMeta = getMessageStatusMeta(row.statusKey);
            return (
              <div
                key={row.id}
                className="flex flex-col gap-[var(--space-xs)] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)]"
                style={{ padding: 'var(--space-md)' }}
              >
                <div className="flex items-start justify-between gap-[var(--space-sm)]">
                  <p className="type-body-sm font-medium text-[var(--color-text)]">{row.subject}</p>
                  <Badge color={statusMeta.badgeColor} size="sm">{statusMeta.label}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="type-body-xs text-[var(--color-text-body)]">{row.sender}</p>
                  <p className="type-body-xs text-[var(--color-text-disabled)]">{row.receivedLabel}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="type-body-sm" style={{ color: 'var(--color-text-placeholder)' }}>
          Showing mock data for messages.
        </p>
      </div>
    </WorkspaceShell>
  );
}
