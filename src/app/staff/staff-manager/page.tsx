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
      router.replace('/f/dashboard');
    }
  }, [token, isStaff, router]);

  if (!token) return null;
  if (!isStaff) return null;

  const currentProfile = resolveStaffProfile(user?.sub, user?.role);

  const regionalStaff = [
    { displayName: 'Sarah Jones', title: 'Regional Manager', office: 'Regional Office', expertise: 'Regional Manager', email: 'sarah.jones@usbr.gov', projects: 45, availability: 'BUSY' as const },
    { displayName: 'Karen Mitchell', title: 'Realty Specialist', office: 'Bend Field Office', expertise: 'Realty Specialist', email: 'k.mitchell@usbr.gov', projects: 8, availability: 'BUSY' as const },
    { displayName: 'Laura Bennett', title: 'Realty Specialist', office: 'Columbia-Cascades Area Office', expertise: 'Realty Specialist', email: 'l.bennett@usbr.gov', projects: 4, availability: 'AVAILABLE' as const },
    { displayName: 'Robert Hayes', title: 'Deputy Field Office Manager', office: 'Ephrata Field Office', expertise: 'Deputy Field Office Manager', email: 'r.hayes@usbr.gov', projects: 0, availability: 'AVAILABLE' as const },
    { displayName: 'Maria Santos', title: 'Realty Specialist', office: 'Grand Coulee Dam', expertise: 'Realty Specialist', email: 'm.santos@usbr.gov', projects: 23, availability: 'OVERLOADED' as const },
    { displayName: 'Tanya Brooks', title: 'Realty Specialist', office: 'Middle Snake Field Office', expertise: 'Realty Specialist', email: 't.brooks@usbr.gov', projects: 11, availability: 'BUSY' as const },
    { displayName: 'Derek Walsh', title: 'Realty Specialist', office: 'Snake River Area Office', expertise: 'Realty Specialist', email: 'd.walsh@usbr.gov', projects: 17, availability: 'OVERLOADED' as const },
    { displayName: 'Brian Foster', title: 'Realty Specialist', office: 'Upper Snake Field Office', expertise: 'Realty Specialist', email: 'b.foster@usbr.gov', projects: 7, availability: 'AVAILABLE' as const },
  ];

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
              <p className="type-heading-h4 text-[var(--color-text)]">{regionalStaff.length}</p>
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
              { key: 'office', header: 'Office' },
              { key: 'projects', header: 'Projects' },
              {
                key: 'availability',
                header: 'Availability',
                render: (value: unknown) => {
                  const v = String(value);
                  const color = v === 'AVAILABLE' ? 'green' : v === 'BUSY' ? 'gold' : 'red';
                  return <Badge color={color} size="sm">{v}</Badge>;
                },
              },
              { key: 'email', header: 'Email' },
            ]}
            data={regionalStaff.map((s) => ({
              displayName: s.displayName,
              title: s.title,
              office: s.office,
              projects: s.projects,
              availability: s.availability,
              email: s.email,
            }))}
          />
        </section>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
