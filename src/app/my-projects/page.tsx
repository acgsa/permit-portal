'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge, type BadgeColor, Progress } from 'usds';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { AnimatedCard, AnimatedTableRow } from '@/components/motion';
import { useAuth } from '@/contexts/AuthContext';

/* ------------------------------------------------------------------ */
/*  Mock project data                                                  */
/* ------------------------------------------------------------------ */

type ProjectRow = {
  id: number;
  projectNumber: string;
  title: string;
  sector: string;
  leadAgency: string;
  statusKey: 'pending' | 'approved' | 'denied';
  formsComplete: number;
  formsTotal: number;
  updatedLabel: string;
};

const MOCK_PROJECTS: ProjectRow[] = [
  {
    id: 1,
    projectNumber: 'C910-04-3198',
    title: 'Elk Basin Natural Gas Pipeline Right-of-Way',
    sector: 'Energy',
    leadAgency: 'BLM',
    statusKey: 'pending',
    formsComplete: 2,
    formsTotal: 5,
    updatedLabel: 'May 28, 2026',
  },
  {
    id: 2,
    projectNumber: 'C710-04-3238',
    title: 'Copper Ridge Mining Access Road',
    sector: 'Mining',
    leadAgency: 'BLM',
    statusKey: 'pending',
    formsComplete: 0,
    formsTotal: 4,
    updatedLabel: 'Apr 10, 2026',
  },
  {
    id: 3,
    projectNumber: 'C510-04-3277',
    title: 'Greenfield Highway Expansion',
    sector: 'Transportation',
    leadAgency: 'FHWA',
    statusKey: 'approved',
    formsComplete: 6,
    formsTotal: 6,
    updatedLabel: 'Jan 22, 2026',
  },
];

function projectStatusMeta(status: string): { label: string; badgeColor: BadgeColor } {
  if (status === 'approved') return { label: 'APPROVED', badgeColor: 'green' };
  if (status === 'denied') return { label: 'DENIED', badgeColor: 'red' };
  return { label: 'PENDING', badgeColor: 'gold' };
}

export default function MyProjectsPage() {
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
      <div className="w-full flex flex-col gap-[var(--space-lg)]">
        <h6 className="type-heading-h6">My Projects</h6>
          <AnimatedCard>
            {/* ── Desktop table ── */}
            <div className="hidden md:block">
              <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg)' }}>
                <div className="overflow-x-auto">
                  <table className="table min-w-[820px]">
                    <thead>
                      <tr>
                        <th className="w-auto">Project</th>
                        <th className="w-24">Sector</th>
                        <th className="w-24">Agency</th>
                        <th className="w-28">Status</th>
                        <th className="w-40">Forms Complete</th>
                        <th className="w-32">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_PROJECTS.map((project, idx) => {
                        const meta = projectStatusMeta(project.statusKey);
                        return (
                          <AnimatedTableRow key={project.id} index={idx}>
                            <td className="type-body-sm">
                              <Link
                                href={`/a/projects/${project.id}`}
                                className="text-[var(--color-text-link)] hover:text-[var(--color-text-link-hover)] hover:underline focus:underline focus:outline-none"
                              >
                                {project.title}
                              </Link>
                            </td>
                            <td className="type-body-sm">{project.sector}</td>
                            <td className="type-body-sm">{project.leadAgency}</td>
                            <td>
                              <Badge color={meta.badgeColor} size="sm">{meta.label}</Badge>
                            </td>
                            <td>
                              <div className="flex items-center" style={{ gap: 'var(--space-xs, 4px)' }}>
                                <div className="flex-1">
                                  <Progress
                                    value={project.formsComplete}
                                    max={project.formsTotal}
                                    size="sm"
                                    variant={project.formsComplete === project.formsTotal ? 'success' : 'default'}
                                  />
                                </div>
                                <span className="type-body-xs text-[var(--color-text-disabled)] whitespace-nowrap">
                                  {project.formsComplete} of {project.formsTotal}
                                </span>
                              </div>
                            </td>
                            <td className="type-body-sm">{project.updatedLabel}</td>
                          </AnimatedTableRow>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* ── Mobile cards ── */}
            <div className="flex flex-col gap-[var(--space-sm)] md:hidden">
              {MOCK_PROJECTS.map((project) => {
                const meta = projectStatusMeta(project.statusKey);
                return (
                  <div
                    key={project.id}
                    className="flex flex-col gap-[var(--space-sm)] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)]"
                    style={{ padding: 'var(--space-md)' }}
                  >
                    <div className="flex items-start justify-between gap-[var(--space-sm)]">
                      <div className="flex-1">
                        <Link
                          href={`/projects/${project.id}`}
                          className="type-body-sm font-medium text-[var(--color-text-link)] hover:underline"
                        >
                          {project.title}
                        </Link>
                        <p className="type-body-xs text-[var(--color-text-disabled)]">
                          {project.sector} · {project.leadAgency}
                        </p>
                      </div>
                      <Badge color={meta.badgeColor} size="sm">{meta.label}</Badge>
                    </div>
                    <div className="flex items-center gap-[var(--space-sm)]">
                      <div className="flex-1">
                        <Progress
                          value={project.formsComplete}
                          max={project.formsTotal}
                          size="sm"
                          variant={project.formsComplete === project.formsTotal ? 'success' : 'default'}
                        />
                      </div>
                      <span className="type-body-xs text-[var(--color-text-disabled)] whitespace-nowrap">
                        {project.formsComplete} of {project.formsTotal}
                      </span>
                    </div>
                    <p className="type-body-xs text-[var(--color-text-disabled)]">{project.updatedLabel}</p>
                  </div>
                );
              })}
            </div>

            <div className="type-body-xs text-[var(--color-text-disabled)]" style={{ paddingTop: 'var(--space-sm, 8px)' }}>
              Showing 1-{MOCK_PROJECTS.length} of {MOCK_PROJECTS.length} projects
            </div>
          </AnimatedCard>
      </div>
    </WorkspaceShell>
  );
}
