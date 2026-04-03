'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Card, Table, TableHeader } from 'usds';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';
import { STAFF_DEMO_USERS, resolveStaffProfile } from '@/lib/mockFederalPortalData';

export default function StaffManagerPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const isStaff = user?.role === 'staff';

  useEffect(() => {
    if (token && !isStaff) {
      router.replace('/dashboard');
    }
  }, [token, isStaff, router]);

  if (!token) return null;
  if (!isStaff) return null;

  const currentProfile = resolveStaffProfile(user?.sub, user?.role);
  const staffRows = STAFF_DEMO_USERS.filter((profile) => profile.role === 'staff');

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
        title="Staff Manager"
        subtitle={`Manage regional staff assignments for ${currentProfile.region}`}
      >
        <section className="grid gap-[var(--space-md)] md:grid-cols-3">
          <Card>
            <div className="flex flex-col gap-[var(--space-xs)]">
              <p className="type-body-sm text-[var(--color-text-body)]">Regional Staff</p>
              <p className="type-heading-h4 text-[var(--color-text)]">{staffRows.length}</p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col gap-[var(--space-xs)]">
              <p className="type-body-sm text-[var(--color-text-body)]">Region</p>
              <p className="type-heading-h4 text-[var(--color-text)]">{currentProfile.region}</p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col gap-[var(--space-xs)]">
              <p className="type-body-sm text-[var(--color-text-body)]">Agency</p>
              <p className="type-heading-h4 text-[var(--color-text)]">{currentProfile.agency}</p>
            </div>
          </Card>
        </section>

        <section>
          <Table
            header={<TableHeader title="Regional Team" />}
            columns={[
              { key: 'displayName', header: 'Name' },
              { key: 'title', header: 'Title' },
              { key: 'agency', header: 'Agency' },
              { key: 'region', header: 'Region' },
              {
                key: 'role',
                header: 'Role',
                render: () => (
                  <Badge color="gold" size="sm">
                    Regional Manager
                  </Badge>
                ),
              },
              { key: 'email', header: 'Email' },
            ]}
            data={staffRows.map((profile) => ({
              displayName: profile.displayName,
              title: profile.title,
              agency: profile.agency,
              region: profile.region,
              role: profile.role,
              email: profile.email,
            }))}
          />
        </section>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
