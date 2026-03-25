'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';
import { STAFF_DEMO_USERS, resolveStaffProfile } from '@/lib/mockFederalPortalData';
import { Badge, Card, Table, TableHeader } from 'usds';

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
            <div className="flex flex-col gap-[var(--space-xs)]">
              <p className="type-body-sm text-[var(--color-text-body)]">Staff Profiles</p>
              <p className="type-heading-h4 text-[var(--color-text)]">{manageableUsers.length}</p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col gap-[var(--space-xs)]">
              <p className="type-body-sm text-[var(--color-text-body)]">Super Admins</p>
              <p className="type-heading-h4 text-[var(--color-text)]">
                {manageableUsers.filter((profile) => profile.role === 'admin').length}
              </p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col gap-[var(--space-xs)]">
              <p className="type-body-sm text-[var(--color-text-body)]">Regional Managers</p>
              <p className="type-heading-h4 text-[var(--color-text)]">
                {manageableUsers.filter((profile) => profile.role === 'staff').length}
              </p>
            </div>
          </Card>
        </section>

        <section>
          <div className="flex flex-col gap-[var(--space-md)]">
            <Table
              header={<TableHeader title="Role Assignment Matrix (Mock Data)" />}
              columns={[
                { key: 'displayName', header: 'Name' },
                { key: 'email', header: 'Email' },
                {
                  key: 'role',
                  header: 'Role',
                  render: (value) => (
                    <Badge color={value === 'admin' ? 'green' : 'gold'} size="sm">
                      {value === 'admin' ? 'Super Admin' : 'Regional Manager'}
                    </Badge>
                  ),
                },
                { key: 'agency', header: 'Agency' },
                {
                  key: 'accessScope',
                  header: 'Access Scope',
                },
              ]}
              data={manageableUsers.map((profile) => ({
                displayName: profile.displayName,
                email: profile.email,
                role: profile.role,
                agency: profile.agency,
                accessScope:
                  profile.role === 'admin' ? 'All agencies and regions' : `${profile.region} region only`,
              }))}
            />
          </div>
        </section>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
