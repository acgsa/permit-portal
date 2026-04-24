'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, type BadgeColor } from 'usds';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';
import { STAFF_MESSAGE_MOCK_ROWS, type StaffMessageRow } from '@/lib/mockFederalPortalData';

function getMessageStatusMeta(status: string): { label: string; badgeColor: BadgeColor } {
  if (status === 'read') return { label: 'READ', badgeColor: 'blue' };
  if (status === 'archived') return { label: 'ARCHIVED', badgeColor: 'steel' };
  return { label: 'UNREAD', badgeColor: 'red' };
}

export default function StaffMessagesPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.replace('/f/staff');
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
      <PortalPageScaffold title="">
        <div className="w-full flex flex-col gap-[var(--space-lg)]">
          <h6 className="type-heading-h6">Messages</h6>

          {/* Desktop table */}
          <div className="hidden md:block">
            <div
              className="overflow-x-auto"
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <table className="table min-w-[760px]">
                <thead>
                  <tr>
                    <th className="w-auto">SUBJECT</th>
                    <th className="w-48">SENDER</th>
                    <th className="w-32">STATUS</th>
                    <th className="w-32">RECEIVED</th>
                  </tr>
                </thead>
                <tbody>
                  {STAFF_MESSAGE_MOCK_ROWS.map((row) => {
                    const statusMeta = getMessageStatusMeta(row.statusKey);
                    return (
                      <tr key={row.id}>
                        <td className="type-body-sm">{row.subject}</td>
                        <td className="type-body-sm text-[var(--color-text-body)]">{row.sender}</td>
                        <td>
                          <Badge color={statusMeta.badgeColor} size="sm">{statusMeta.label}</Badge>
                        </td>
                        <td className="type-body-sm">{row.receivedLabel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-[var(--space-sm)] md:hidden">
            {STAFF_MESSAGE_MOCK_ROWS.map((row) => {
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

          <p className="type-body-xs text-[var(--color-text-disabled)]">
            Showing {STAFF_MESSAGE_MOCK_ROWS.length} messages
          </p>
        </div>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
