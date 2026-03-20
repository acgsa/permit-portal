'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Card } from '@/components/Card';
import { Button } from 'usds';
import { useAuth } from '@/contexts/AuthContext';

const RESOURCE_LINKS = [
  {
    title: 'Application Checklist (Mock)',
    description: 'Starter checklist for permit package components, schedules, and supporting documentation.',
  },
  {
    title: 'Interagency Milestone Calendar (Mock)',
    description: 'Sample milestone sequence showing intake, screening, consultation, and decision windows.',
  },
  {
    title: 'Data and Mapping Inputs (Mock)',
    description: 'Reference list of common geospatial and technical datasets used in preliminary review.',
  },
  {
    title: 'Submission Readiness Guide (Mock)',
    description: 'Preparation guide for reducing avoidable review delays before formal submittal.',
  },
];

export default function ResourcesPage() {
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
      <div className="flex w-full flex-col gap-[var(--space-md)] bg-[var(--color-bg)] p-[var(--space-md)]">
        <header className="flex flex-col gap-[var(--space-xs)]">
          <p className="type-body-xs uppercase tracking-[0.14em] text-[var(--color-text-disabled)]">Applicant Portal</p>
          <h1 className="type-heading-h4">Resources</h1>
          <p className="type-body-md max-w-4xl text-[var(--color-text-body)]">
            Mock support resources for planning, documentation, and coordination across applicant and federal staff workflows.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-[var(--space-md)] md:grid-cols-2">
          {RESOURCE_LINKS.map((item) => (
            <Card key={item.title}>
              <div className="flex flex-col gap-[var(--space-sm)]">
                <h2 className="type-heading-h6">{item.title}</h2>
                <p className="type-body-sm text-[var(--color-text-body)]">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-[var(--space-sm)]">
          <Link href="/permit-types">
            <Button variant="secondary" size="sm">Back to Permit Types</Button>
          </Link>
          <Link href="/regulations">
            <Button variant="outline" size="sm">Review Regulations</Button>
          </Link>
        </div>
      </div>
    </WorkspaceShell>
  );
}
