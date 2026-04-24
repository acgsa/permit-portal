'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Badge, type BadgeColor } from 'usds';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';
import {
  FEDERAL_APPLICATION_MOCK_DATA,
  resolveStaffProfile,
  getVisibleFederalApplications,
  type FederalApplicationRecord,
} from '@/lib/mockFederalPortalData';

function getStatusMeta(status: FederalApplicationRecord['status']): { label: string; badgeColor: BadgeColor } {
  if (status === 'Approved') return { label: 'APPROVED', badgeColor: 'green' };
  if (status === 'In Review') return { label: 'IN REVIEW', badgeColor: 'blue' };
  if (status === 'Pending Interagency') return { label: 'PENDING INTERAGENCY', badgeColor: 'gold' };
  return { label: 'SUBMITTED', badgeColor: 'steel' };
}

export default function StaffProjectsPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) router.replace('/f/staff');
  }, [token, router]);

  if (!token) return null;

  const profile = resolveStaffProfile(user?.sub, user?.role);
  const visible = getVisibleFederalApplications(profile);

  const filtered = search.trim()
    ? visible.filter((r) => {
        const q = search.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.applicantName.toLowerCase().includes(q) ||
          r.permitType.toLowerCase().includes(q)
        );
      })
    : visible;

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
          <div className="flex items-center justify-between gap-[var(--space-md)]">
            <h6 className="type-heading-h6">Projects</h6>
            <span className="type-body-xs text-[var(--color-text-disabled)]">
              {filtered.length} of {visible.length} shown
            </span>
          </div>

          {/* Search */}
          <div>
            <input
              type="search"
              placeholder="Search by ID, applicant, or permit type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] type-body-sm text-[var(--color-text)] placeholder:text-[var(--color-text-disabled)]"
              style={{ padding: 'var(--space-xs) var(--space-sm)' }}
            />
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <section
              className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]"
              style={{ background: 'var(--color-bg)' }}
            >
              <div className="overflow-x-auto">
                <table className="table min-w-[860px]">
                  <thead>
                    <tr>
                      <th className="w-36">PID</th>
                      <th className="w-auto">APPLICANT</th>
                      <th className="w-56">PERMIT TYPE</th>
                      <th className="w-40">STATUS</th>
                      <th className="w-40">REVIEWER</th>
                      <th className="w-32">SUBMITTED</th>
                      <th className="w-20">VIEW</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => {
                      const { label, badgeColor } = getStatusMeta(row.status);
                      return (
                        <tr key={row.id}>
                          <td className="type-body-xs font-mono text-[var(--color-text-disabled)]">{row.id}</td>
                          <td className="type-body-sm font-medium text-[var(--color-text)]">{row.applicantName}</td>
                          <td className="type-body-sm text-[var(--color-text-body)]">{row.permitType}</td>
                          <td><Badge color={badgeColor} size="sm">{label}</Badge></td>
                          <td className="type-body-sm text-[var(--color-text-body)]">{row.assignedReviewer}</td>
                          <td className="type-body-sm text-[var(--color-text-body)]">
                            {new Date(row.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td>
                            <Link
                              href={`/f/projects/${row.id}`}
                              className="text-[var(--color-text-link)] hover:text-[var(--color-text-link-hover)]"
                              aria-label={`View project ${row.id}`}
                            >
                              <Eye size={18} />
                            </Link>
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
            {filtered.map((row) => {
              const { label, badgeColor } = getStatusMeta(row.status);
              return (
                <div
                  key={row.id}
                  className="flex flex-col gap-[var(--space-xs)] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)]"
                  style={{ padding: 'var(--space-md)' }}
                >
                  <div className="flex items-start justify-between gap-[var(--space-sm)]">
                    <div className="flex-1">
                      <p className="type-body-sm font-medium text-[var(--color-text)]">{row.applicantName}</p>
                      <p className="type-body-xs text-[var(--color-text-disabled)]">{row.id} · {row.permitType}</p>
                    </div>
                    <Badge color={badgeColor} size="sm">{label}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="type-body-xs text-[var(--color-text-disabled)]">
                      {row.assignedReviewer} · {new Date(row.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <Link
                      href={`/f/projects/${row.id}`}
                      className="text-[var(--color-text-link)] hover:text-[var(--color-text-link-hover)]"
                      aria-label={`View project ${row.id}`}
                    >
                      <Eye size={18} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
