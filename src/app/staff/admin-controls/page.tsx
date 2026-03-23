'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';
import { STAFF_DEMO_USERS, resolveStaffProfile } from '@/lib/mockFederalPortalData';

export default function AdminControlsPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (token && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [token, isAdmin, router]);

  if (!token) return null;

  if (!isAdmin) {
    return null;
  }

  const currentProfile = resolveStaffProfile(user?.sub, user?.role);
  const manageableUsers = STAFF_DEMO_USERS;

  return (
    <WorkspaceShell
      role={user?.role}
      userSub={user?.sub}
      organizationLabel={currentProfile.agency}
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      <PortalPageScaffold
        eyebrow="Federal Staff Portal"
        title="Admin Controls"
        subtitle="Manage role-based visibility and who can view federal application queues."
      >

        <section className="grid gap-[var(--space-md)] md:grid-cols-3">
          <Card>
            <p className="type-body-sm text-steel-400">Staff Profiles</p>
            <p className="type-heading-h4 mt-[var(--space-xs)] text-white">{manageableUsers.length}</p>
          </Card>
          <Card>
            <p className="type-body-sm text-steel-400">Super Admins</p>
            <p className="type-heading-h4 mt-[var(--space-xs)] text-white">
              {manageableUsers.filter((profile) => profile.role === 'admin').length}
            </p>
          </Card>
          <Card>
            <p className="type-body-sm text-steel-400">Regional Managers</p>
            <p className="type-heading-h4 mt-[var(--space-xs)] text-white">
              {manageableUsers.filter((profile) => profile.role === 'staff').length}
            </p>
          </Card>
        </section>

        <section>
          <h2 className="type-heading-h6 mb-[var(--space-sm)] text-[var(--color-text)]">Role Assignment Matrix (Mock Data)</h2>
          <div className="overflow-x-auto rounded-sm border border-white/10 bg-white/[0.02]">
            <table className="min-w-full type-body-sm">
              <thead className="bg-white/[0.04] text-left text-steel-300 type-body-strong-sm">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Agency</th>
                  <th className="px-4 py-3 font-medium">Access Scope</th>
                </tr>
              </thead>
              <tbody>
                {manageableUsers.map((profile) => (
                  <tr key={profile.id} className="border-t border-white/10">
                    <td className="px-4 py-3 text-steel-200">{profile.displayName}</td>
                    <td className="px-4 py-3 text-steel-300">{profile.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-900">
                        {profile.role === 'admin' ? 'Super Admin' : 'Regional Manager'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-steel-300">{profile.agency}</td>
                    <td className="px-4 py-3 text-steel-300">
                      {profile.role === 'admin' ? 'All agencies and regions' : `${profile.region} region only`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
