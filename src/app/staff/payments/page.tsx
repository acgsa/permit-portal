'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, type BadgeColor } from 'usds';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';
import { PAYMENT_MOCK_DATA, type PaymentRecord } from '@/lib/mockFederalPortalData';

function getPaymentStatusMeta(status: PaymentRecord['status']): { label: string; badgeColor: BadgeColor } {
  if (status === 'paid') return { label: 'PAID', badgeColor: 'green' };
  if (status === 'waived') return { label: 'WAIVED', badgeColor: 'steel' };
  return { label: 'PENDING', badgeColor: 'gold' };
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function StaffPaymentsPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.replace('/f/staff');
    else if (user?.role !== 'admin') router.replace('/f/dashboard');
  }, [token, user, router]);

  if (!token || user?.role !== 'admin') return null;

  /* KPI totals */
  const totalAssessed = PAYMENT_MOCK_DATA.filter((p) => p.status !== 'waived').reduce((sum, p) => sum + p.amount, 0);
  const totalCollected = PAYMENT_MOCK_DATA.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = PAYMENT_MOCK_DATA.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalWaived = PAYMENT_MOCK_DATA.filter((p) => p.status === 'waived').length;

  const kpis = [
    { label: 'Total Assessed', value: `$${totalAssessed.toLocaleString()}` },
    { label: 'Total Collected', value: `$${totalCollected.toLocaleString()}` },
    { label: 'Pending', value: `$${totalPending.toLocaleString()}` },
    { label: 'Waived', value: `${totalWaived} application${totalWaived !== 1 ? 's' : ''}` },
  ];

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
          <h6 className="type-heading-h6">Payments</h6>

          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-[var(--space-sm)] md:grid-cols-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="flex flex-col gap-[var(--space-xs)] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]"
                style={{ padding: 'var(--space-md)' }}
              >
                <p className="type-body-xs text-[var(--color-text-disabled)]">{kpi.label}</p>
                <p className="type-heading-h5 text-[var(--color-text)]">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <section
              className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]"
              style={{ background: 'var(--color-bg)' }}
            >
              <div className="overflow-x-auto">
                <table className="table min-w-[900px]">
                  <thead>
                    <tr>
                      <th className="w-36">PID</th>
                      <th className="w-auto">APPLICANT</th>
                      <th className="w-48">FEE TYPE</th>
                      <th className="w-28">AMOUNT</th>
                      <th className="w-32">STATUS</th>
                      <th className="w-32">DATE</th>
                      <th className="w-40">PAY.GOV ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PAYMENT_MOCK_DATA.map((row) => {
                      const { label, badgeColor } = getPaymentStatusMeta(row.status);
                      return (
                        <tr key={row.id}>
                          <td className="type-body-xs font-mono text-[var(--color-text-disabled)]">{row.applicationId}</td>
                          <td className="type-body-sm text-[var(--color-text)]">{row.applicantName}</td>
                          <td className="type-body-sm text-[var(--color-text-body)]">{row.feeType}</td>
                          <td className="type-body-sm text-[var(--color-text)]">
                            {row.amount === 0 ? '—' : `$${row.amount.toLocaleString()}`}
                          </td>
                          <td><Badge color={badgeColor} size="sm">{label}</Badge></td>
                          <td className="type-body-sm text-[var(--color-text-body)]">{formatDate(row.paymentDate)}</td>
                          <td className="type-body-xs font-mono text-[var(--color-text-disabled)]">
                            {row.paygovTrackingId ?? '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-[var(--space-sm)] md:hidden">
            {PAYMENT_MOCK_DATA.map((row) => {
              const { label, badgeColor } = getPaymentStatusMeta(row.status);
              return (
                <div
                  key={row.id}
                  className="flex flex-col gap-[var(--space-xs)] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)]"
                  style={{ padding: 'var(--space-md)' }}
                >
                  <div className="flex items-start justify-between gap-[var(--space-sm)]">
                    <div className="flex-1">
                      <p className="type-body-sm font-medium text-[var(--color-text)]">{row.applicantName}</p>
                      <p className="type-body-xs text-[var(--color-text-disabled)]">{row.applicationId} · {row.feeType}</p>
                    </div>
                    <Badge color={badgeColor} size="sm">{label}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="type-body-sm text-[var(--color-text)]">
                      {row.amount === 0 ? 'Waived' : `$${row.amount.toLocaleString()}`}
                    </p>
                    <p className="type-body-xs text-[var(--color-text-disabled)]">{formatDate(row.paymentDate)}</p>
                  </div>
                  {row.paygovTrackingId && (
                    <p className="type-body-xs font-mono text-[var(--color-text-disabled)]">{row.paygovTrackingId}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
