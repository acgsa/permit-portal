
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAuth } from '@/contexts/AuthContext';
import { Badge, type BadgeColor, Button, PlusIcon, Progress } from 'usds';

/* ------------------------------------------------------------------ */
/*  Project + task mock data (mirrors my-projects & project detail)    */
/* ------------------------------------------------------------------ */

type ProjectSummary = {
  id: number;
  projectNumber: string;
  title: string;
  sector: string;
  leadAgency: string;
  statusKey: 'pending' | 'approved' | 'denied';
  formsComplete: number;
  formsTotal: number;
  nextTask: { name: string; status: 'in-progress' | 'not-started' | 'overdue' } | null;
};

const PROJECTS: ProjectSummary[] = [
  {
    id: 1,
    projectNumber: 'C910-04-3198',
    title: 'Elk Basin Natural Gas Pipeline Right-of-Way',
    sector: 'Energy',
    leadAgency: 'BLM',
    statusKey: 'pending',
    formsComplete: 2,
    formsTotal: 5,
    nextTask: { name: 'Upload Cultural Resource Survey', status: 'in-progress' },
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
    nextTask: { name: 'Submit Mining Plan of Operations', status: 'overdue' },
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
    nextTask: null,
  },
];

function statusMeta(key: string): { label: string; badgeColor: BadgeColor } {
  if (key === 'approved') return { label: 'APPROVED', badgeColor: 'green' };
  if (key === 'denied') return { label: 'DENIED', badgeColor: 'red' };
  return { label: 'PENDING', badgeColor: 'gold' };
}

function taskBadge(status: string): { label: string; badgeColor: BadgeColor } {
  if (status === 'in-progress') return { label: 'IN PROGRESS', badgeColor: 'blue' };
  if (status === 'overdue') return { label: 'OVERDUE', badgeColor: 'red' };
  return { label: 'NOT STARTED', badgeColor: 'steel' };
}

export default function HomePage() {
  const INTAKE_SUBMISSION_KEY = 'permit.projectIntake.submitted.v1';
  const INTAKE_DRAFT_KEY = 'permit.projectIntake.v1';
  const firstName = 'John Doe';
  const router = useRouter();
  const { user, logout } = useAuth();
  const [intakeSubmission, setIntakeSubmission] = useState<{ submittedAt: string; title: string } | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get('intake_submitted') === '1';
    const raw = window.localStorage.getItem(INTAKE_SUBMISSION_KEY);

    if (!raw && !fromQuery) {
      setIntakeSubmission(null);
      return;
    }

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { submittedAt?: string; title?: string };
        if (parsed.submittedAt) {
          setIntakeSubmission({
            submittedAt: parsed.submittedAt,
            title: parsed.title ?? 'Project Intake',
          });
          return;
        }
      } catch {
        window.localStorage.removeItem(INTAKE_SUBMISSION_KEY);
      }
    }

    if (fromQuery) {
      const payload = {
        submittedAt: new Date().toISOString(),
        title: 'Project Intake',
      };
      window.localStorage.setItem(INTAKE_SUBMISSION_KEY, JSON.stringify(payload));
      setIntakeSubmission(payload);
    }
  }, []);

  /* -- Detect saved draft -- */
  useEffect(() => {
    const submission = window.localStorage.getItem(INTAKE_SUBMISSION_KEY);
    if (submission) { setHasDraft(false); return; }

    const draft = window.localStorage.getItem(INTAKE_DRAFT_KEY);
    if (!draft) { setHasDraft(false); return; }

    try {
      const parsed = JSON.parse(draft) as Record<string, unknown>;
      const hasContent = Object.values(parsed).some((v) =>
        typeof v === 'string' ? v.trim() !== '' : Array.isArray(v) ? v.length > 0 : typeof v === 'object' && v !== null
      );
      setHasDraft(hasContent);
      if (hasContent && parsed.lastSavedAt) {
        setDraftSavedAt(parsed.lastSavedAt as string);
      }
    } catch {
      setHasDraft(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'staff' || user?.role === 'admin') {
      router.replace('/dashboard');
    }
  }, [user?.role, router]);

  if (user?.role === 'staff' || user?.role === 'admin') {
    return null;
  }

  const totalProjects = PROJECTS.length;
  const pendingProjects = PROJECTS.filter((p) => p.statusKey === 'pending').length;
  const approvedProjects = PROJECTS.filter((p) => p.statusKey === 'approved').length;
  const deniedProjects = PROJECTS.filter((p) => p.statusKey === 'denied').length;

  const summaryCards = [
    { label: 'Total Projects', value: totalProjects, color: 'var(--color-text)' },
    { label: 'Pending', value: pendingProjects, color: '#f59e0b' },
    { label: 'Approved', value: approvedProjects, color: '#10b981' },
    { label: 'Denied', value: deniedProjects, color: 'var(--color-error, #ef4444)' },
  ];

  const projectsWithTasks = PROJECTS.filter((p) => p.nextTask !== null);

  return (
    <WorkspaceShell
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      <div className="min-h-full bg-[var(--color-bg)] p-[var(--space-md)]">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-[var(--space-xl)]">
          {/* ── Welcome header ── */}
          <section className="flex flex-col gap-[var(--space-md)]">
            <p className="text-sm font-medium text-[var(--color-text-body)]">Welcome back</p>

            <div className="flex flex-col gap-[var(--space-sm)] sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl md:text-6xl">{firstName}</h1>

              <div className="sm:shrink-0">
                <Button
                  variant="secondary"
                  size="md"
                  className="px-[var(--space-lg)] font-semibold"
                  leadingIcon={<PlusIcon size={16} />}
                  onClick={() => router.push('/project-intake')}
                >
                  <span>Start New Project</span>
                </Button>
              </div>
            </div>
          </section>

          {/* ── Resume draft banner ── */}
          {hasDraft && (
            <section
              className="flex flex-col gap-[var(--space-sm)] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] sm:flex-row sm:items-center sm:justify-between"
              style={{ paddingInline: 'var(--space-md)', paddingBlock: 'var(--space-md)' }}
            >
              <div>
                <p className="type-body-sm font-medium text-[var(--color-text)]">You have an unfinished project intake</p>
                {draftSavedAt && <p className="type-body-xs text-[var(--color-text-disabled)]">Last saved {new Date(draftSavedAt).toLocaleString()}</p>}
              </div>
              <Button variant="primary" size="sm" onClick={() => router.push('/project-intake')}>
                Resume Draft
              </Button>
            </section>
          )}

          {/* ── Summary cards ── */}
          <section
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] shadow-[var(--shadow-sm)]"
            style={{ padding: 'var(--space-xs)' }}
          >
            <div className="grid grid-cols-2 gap-[var(--space-md)] lg:grid-cols-4 lg:gap-0">
              {summaryCards.map((item, index) => (
                <div
                  key={item.label}
                  className="relative flex min-h-[100px] sm:min-h-[148px] flex-col justify-between rounded-[var(--radius-sm)] lg:rounded-none"
                  style={{ padding: 'var(--space-md) var(--space-lg)' }}
                >
                  {index > 0 ? (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-[var(--space-md)] left-0 top-[var(--space-md)] hidden w-px bg-[var(--color-border)] lg:block"
                    />
                  ) : null}
                  <p className="text-base font-medium text-[var(--color-text-body)]">{item.label}</p>
                  <h2 style={{ color: item.color, margin: 0 }} className="type-heading-h2 leading-none">
                    {item.value}
                  </h2>
                </div>
              ))}
            </div>
          </section>

          {/* ── My Projects overview ── */}
          <section className="flex flex-col gap-[var(--space-md)]">
            <div className="flex items-center justify-between gap-[var(--space-sm)]">
              <h2 className="type-heading-h6 text-[var(--color-text)]">My Projects</h2>
              <Button variant="primary" size="sm" onClick={() => router.push('/my-projects')}>
                View All Projects
              </Button>
            </div>

            <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-[var(--color-border)]">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="w-auto">Project</th>
                    <th className="w-24">Agency</th>
                    <th className="w-28">Status</th>
                    <th className="w-40">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {PROJECTS.map((project) => {
                    const meta = statusMeta(project.statusKey);
                    return (
                      <tr key={project.id}>
                        <td className="type-body-sm">
                          <Link
                            href={`/projects/${project.id}`}
                            className="text-[var(--color-text-link)] hover:text-[var(--color-text-link-hover)] hover:underline focus:underline focus:outline-none"
                          >
                            {project.title}
                          </Link>
                          <p className="type-body-xs text-[var(--color-text-disabled)]">{project.projectNumber}</p>
                        </td>
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
                              {project.formsComplete}/{project.formsTotal}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Task quick links ── */}
          <section className="flex flex-col gap-[var(--space-md)]">
            <div className="flex items-center justify-between gap-[var(--space-sm)]">
              <h2 className="type-heading-h6 text-[var(--color-text)]">Action Needed</h2>
            </div>

            {projectsWithTasks.length === 0 ? (
              <p className="type-body-sm text-[var(--color-text-body)]">
                No pending tasks. You&apos;re all caught up!
              </p>
            ) : (
              <div className="flex flex-col gap-[var(--space-sm)]">
                {projectsWithTasks.map((project) => {
                  const task = project.nextTask!;
                  const tMeta = taskBadge(task.status);
                  return (
                    <div
                      key={project.id}
                      className="flex flex-col gap-[var(--space-sm)] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] md:flex-row md:items-center md:justify-between"
                      style={{
                        paddingInlineStart: 'var(--space-md, 16px)',
                        paddingInlineEnd: 'var(--space-lg, 24px)',
                        paddingBlock: 'var(--space-md, 16px)',
                      }}
                    >
                      <div className="flex-1 md:pr-[var(--space-xl)]">
                        <div className="flex items-center gap-[var(--space-sm)]">
                          <p className="type-body-sm font-medium text-[var(--color-text)]">{task.name}</p>
                          <Badge color={tMeta.badgeColor} size="sm">{tMeta.label}</Badge>
                        </div>
                        <p className="mt-[var(--space-2xs)] type-body-xs text-[var(--color-text-disabled)]">
                          {project.projectNumber} · {project.title}
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push(`/projects/${project.id}`)}
                      >
                        {task.status === 'in-progress' || task.status === 'overdue' ? 'Continue' : 'Start'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {intakeSubmission ? (
            <section className="flex flex-col gap-[var(--space-sm)]">
              <p className="type-body-md text-[var(--color-text-body)]">
                Our team will review the details and contact you soon with the exact federal forms you need (including a pre-filled SF-299 if applicable).
              </p>
              <p className="type-body-sm text-[var(--color-text-body)]">
                You will receive an email confirmation shortly.
              </p>

              <div
                className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)]"
                style={{ paddingInline: 'var(--space-md)', paddingBlock: 'var(--space-md)' }}
              >
                <p className="type-body-sm text-[var(--color-text)]">{intakeSubmission.title} submitted</p>
                <p className="type-body-xs text-[var(--color-text-body)]">
                  Submitted {new Date(intakeSubmission.submittedAt).toLocaleString()}
                </p>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </WorkspaceShell>
  );
}
