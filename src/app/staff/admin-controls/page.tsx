'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAuth } from '@/contexts/AuthContext';
import { STAFF_DEMO_USERS, resolveStaffProfile } from '@/lib/mockFederalPortalData';

export default function AdminControlsPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  if (!token) return null;

  if (user?.role !== 'admin') {
    router.replace('/dashboard');
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
      <div className="w-full space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Admin Controls</h1>
          <p className="mt-2 text-steel-300">
            Manage role-based visibility and who can view federal application queues.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-steel-400">Staff Profiles</p>
            <p className="mt-1 text-3xl font-semibold text-white">{manageableUsers.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-steel-400">Super Admins</p>
            <p className="mt-1 text-3xl font-semibold text-white">
              {manageableUsers.filter((profile) => profile.role === 'admin').length}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-steel-400">Regional Managers</p>
            <p className="mt-1 text-3xl font-semibold text-white">
              {manageableUsers.filter((profile) => profile.role === 'staff').length}
            </p>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Role Assignment Matrix (Mock Data)</h2>
          <div className="overflow-x-auto rounded-sm border border-white/10 bg-white/[0.02]">
            <table className="min-w-full text-sm">
              <thead className="bg-white/[0.04] text-left text-steel-300">
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
      </div>
    </WorkspaceShell>
  );
}
