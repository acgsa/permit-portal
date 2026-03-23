'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';
import {
  getVisibleFederalApplications,
  resolveStaffProfile,
  type FederalApplicationRecord,
} from '@/lib/mockFederalPortalData';

function statusPillClass(status: FederalApplicationRecord['status']): string {
  switch (status) {
    case 'Approved':
      return 'bg-emerald-100 text-emerald-800';
    case 'Pending Interagency':
      return 'bg-amber-100 text-amber-800';
    case 'In Review':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-slate-200 text-slate-800';
  }
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const isStaffUser = user?.role === 'staff' || user?.role === 'admin';

  useEffect(() => {
    if (token && !isStaffUser) {
      router.replace('/home');
    }
  }, [token, isStaffUser, router]);

  if (!token) return null;

  if (!isStaffUser) {
    return null;
  }

  const staffProfile = resolveStaffProfile(user?.sub, user?.role);
  const visibleApplications = getVisibleFederalApplications(staffProfile);

  const submittedCount = visibleApplications.filter((item) => item.status === 'Submitted').length;
  const inReviewCount = visibleApplications.filter((item) => item.status === 'In Review').length;
  const pendingInteragencyCount = visibleApplications.filter(
    (item) => item.status === 'Pending Interagency',
  ).length;
  const approvedCount = visibleApplications.filter((item) => item.status === 'Approved').length;

  return (
    <WorkspaceShell
      role={user?.role}
      userSub={user?.sub}
      organizationLabel={staffProfile.agency}
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      <PortalPageScaffold
        eyebrow="Federal Staff Portal"
        title="Federal Staff Dashboard"
        subtitle={`${staffProfile.displayName} · ${staffProfile.title} · Scope: ${staffProfile.role === 'admin' ? 'All agencies and regions' : `${staffProfile.region} region`} · ${staffProfile.agency}`}
        actions={
          staffProfile.role === 'admin' ? (
            <Link
              href="/staff/admin-controls"
              className="rounded-sm bg-[var(--color-btn-primary-bg)] px-4 py-2 type-body-strong-sm text-[var(--color-btn-primary-text)] hover:bg-[var(--color-btn-primary-bg-hover)]"
            >
              Open Admin Controls
            </Link>
          ) : null
        }
      >

        <section className="grid gap-[var(--space-md)] sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <p className="type-body-sm text-steel-500">Submitted</p>
            <p className="type-heading-h4 mt-[var(--space-xs)] text-white">{submittedCount}</p>
          </Card>
          <Card>
            <p className="type-body-sm text-steel-500">In Review</p>
            <p className="type-heading-h4 mt-[var(--space-xs)] text-white">{inReviewCount}</p>
          </Card>
          <Card>
            <p className="type-body-sm text-steel-500">Pending Interagency</p>
            <p className="type-heading-h4 mt-[var(--space-xs)] text-white">{pendingInteragencyCount}</p>
          </Card>
          <Card>
            <p className="type-body-sm text-steel-500">Approved</p>
            <p className="type-heading-h4 mt-[var(--space-xs)] text-white">{approvedCount}</p>
          </Card>
        </section>

        <section>
          <h2 className="type-heading-h6 mb-[var(--space-sm)] text-[var(--color-text)]">Current Agency Applications</h2>
          <div className="overflow-x-auto rounded-sm border border-white/10 bg-white/[0.02]">
            <table className="min-w-full type-body-sm">
              <thead className="bg-white/[0.04] text-left text-steel-300 type-body-strong-sm">
                <tr>
                  <th className="px-4 py-3 font-medium">Application ID</th>
                  <th className="px-4 py-3 font-medium">Applicant</th>
                  <th className="px-4 py-3 font-medium">Permit Type</th>
                  <th className="px-4 py-3 font-medium">Agency</th>
                  <th className="px-4 py-3 font-medium">Region</th>
                  <th className="px-4 py-3 font-medium">Assigned Reviewer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {visibleApplications.map((application) => (
                  <tr key={application.id} className="border-t border-white/10">
                    <td className="px-4 py-3 font-mono text-steel-200">{application.id}</td>
                    <td className="px-4 py-3 text-steel-200">{application.applicantName}</td>
                    <td className="px-4 py-3 text-steel-200">{application.permitType}</td>
                    <td className="px-4 py-3 text-steel-300">{application.agency}</td>
                    <td className="px-4 py-3 text-steel-300">{application.region}</td>
                    <td className="px-4 py-3 text-steel-300">{application.assignedReviewer}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusPillClass(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-steel-300">{application.updatedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-[var(--space-md)] sm:grid-cols-2">
          <Card>
            <h3 className="type-heading-h6 text-white">Access Model (Demo)</h3>
            <p className="type-body-sm mt-[var(--space-xs)] text-steel-300">
              Super Admin users can view every application in every region and agency.
              Regional managers can view only applications in their assigned region.
            </p>
          </Card>
          <Card>
            <h3 className="type-heading-h6 text-white">Tools</h3>
            <div className="mt-[var(--space-sm)] flex flex-wrap gap-[var(--space-sm)]">
              <Link href="/staff/workflow-manager" className="rounded-sm border border-white/20 px-3 py-2 type-body-sm text-steel-100 hover:bg-white/10">
                Workflow Manager
              </Link>
              <Link href="/home/help-desk" className="rounded-sm border border-white/20 px-3 py-2 type-body-sm text-steel-100 hover:bg-white/10">
                Help Desk
              </Link>
              <Link href="/resources" className="rounded-sm border border-white/20 px-3 py-2 type-body-sm text-steel-100 hover:bg-white/10">
                Resource Center
              </Link>
              {staffProfile.role === 'admin' && (
                <Link href="/staff/admin-controls" className="rounded-sm border border-white/20 px-3 py-2 type-body-sm text-steel-100 hover:bg-white/10">
                  Manage Access Controls
                </Link>
              )}
            </div>
          </Card>
        </section>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
