
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAuth } from '@/contexts/AuthContext';
import { Button, PlusIcon } from 'usds';
import * as api from '@/lib/api';

type ApplicantDisplayRow = {
  id: number;
  title: string;
  permitNumber: string;
  statusKey: 'in_review' | 'in_progress' | 'pending' | 'rejected' | 'approved';
  updatedLabel: string;
};

const APPLICANT_MOCK_ROWS: ApplicantDisplayRow[] = [
  {
    id: 1,
    title: '3-200-14: Eagle Exhibition Toms River Avian Care Don Bonica',
    permitNumber: 'C910043198',
    statusKey: 'in_review',
    updatedLabel: 'May 12, 2025',
  },
  {
    id: 2,
    title: '3-200-8: Migratory Bird - Taxidermy',
    permitNumber: 'C710043238',
    statusKey: 'in_review',
    updatedLabel: 'May 12, 2025',
  },
  {
    id: 3,
    title: '3-200-21: Import of Sport-Hunted Trophies of Argali from Mongolia; 2016',
    permitNumber: 'C710043197',
    statusKey: 'in_progress',
    updatedLabel: 'May 12, 2025',
  },
  {
    id: 4,
    title: '3-200-13: Migratory Bird - Depredation',
    permitNumber: 'C510043277',
    statusKey: 'rejected',
    updatedLabel: 'May 12, 2025',
  },
  {
    id: 5,
    title: '3-200-21: Import of Sport-Hunted Trophies of Argali from Mongolia; 2016',
    permitNumber: 'C210043823',
    statusKey: 'approved',
    updatedLabel: 'Sep 12, 2023',
  },
  {
    id: 6,
    title: '3-200-13: Migratory Bird - Depredation',
    permitNumber: 'C110043934',
    statusKey: 'approved',
    updatedLabel: 'May 12, 2025',
  },
];

function toTitleCase(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatPermitNumber(id: number): string {
  return `C${String(id).padStart(8, '0')}`;
}

export default function HomePage() {
  const GUIDANCE_SUBMISSION_KEY = 'permit.guidanceRequest.submitted.v1';
  const firstName = 'John Doe';
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [workflows, setWorkflows] = useState<api.WorkflowStatus[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [guidanceSubmission, setGuidanceSubmission] = useState<{ submittedAt: string; title: string } | null>(null);

  useEffect(() => {
    if (!token) return;
    api
      .listWorkflows(token)
      .then(setWorkflows)
      .catch((err: unknown) => setFetchError(err instanceof Error ? err.message : 'Failed to load workflows'))
      .finally(() => setLoadingWorkflows(false));
  }, [token]);

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get('guidance_submitted') === '1';
    const raw = window.localStorage.getItem(GUIDANCE_SUBMISSION_KEY);

    if (!raw && !fromQuery) {
      setGuidanceSubmission(null);
      return;
    }

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { submittedAt?: string; title?: string };
        if (parsed.submittedAt) {
          setGuidanceSubmission({
            submittedAt: parsed.submittedAt,
            title: parsed.title ?? 'Application Guidance Request',
          });
          return;
        }
      } catch {
        window.localStorage.removeItem(GUIDANCE_SUBMISSION_KEY);
      }
    }

    if (fromQuery) {
      const payload = {
        submittedAt: new Date().toISOString(),
        title: 'Application Guidance Request',
      };
      window.localStorage.setItem(GUIDANCE_SUBMISSION_KEY, JSON.stringify(payload));
      setGuidanceSubmission(payload);
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

  const summary = useMemo(() => {
    const applicantRows = [...workflows].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );

    const mappedRows: ApplicantDisplayRow[] = applicantRows.map((wf) => ({
      id: wf.id,
      title: toTitleCase(wf.process_name),
      permitNumber: formatPermitNumber(wf.id),
      statusKey:
        wf.status === 'completed'
          ? 'approved'
          : wf.status === 'error'
            ? 'rejected'
            : wf.status === 'running'
              ? 'in_review'
              : 'in_progress',
      updatedLabel: 'May 12, 2025',
    }));

    const hasMalformedData = mappedRows.some(
      (row) => row.title.includes('"detail"') || row.title.includes('Field Required') || row.title.includes('token'),
    );

    const visibleRows = !!fetchError || hasMalformedData || mappedRows.length === 0 ? APPLICANT_MOCK_ROWS : mappedRows;

    const total = visibleRows.length;
    const open = visibleRows.filter((row) => row.statusKey === 'in_review' || row.statusKey === 'in_progress').length;
    const inReview = visibleRows.filter((row) => row.statusKey === 'in_review').length;
    const inProgress = visibleRows.filter((row) => row.statusKey === 'in_progress').length;
    const approved = visibleRows.filter((row) => row.statusKey === 'approved').length;
    const rejected = visibleRows.filter((row) => row.statusKey === 'rejected').length;

    return {
      visibleRows,
      useMockRows: !!fetchError || hasMalformedData || mappedRows.length === 0,
      cards: [
        { label: 'Total Applications', value: total, color: 'var(--color-text)' },
        { label: 'Open Applications', value: open, color: '#f59e0b' },
        { label: 'Approved', value: approved, color: '#10b981' },
        { label: 'Rejected', value: rejected, color: '#f43f5e' },
      ],
      open,
      inReview,
      inProgress,
      approved,
      rejected,
    };
  }, [workflows, fetchError]);

  return (
    <WorkspaceShell
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      <div className="min-h-full bg-[var(--color-bg)] p-[var(--space-md)]">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-[var(--space-xl)]">
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
                  onClick={() => router.push('/screener')}
                >
                  <span>Start New Application</span>
                </Button>
              </div>
            </div>
          </section>

          <section
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] shadow-[var(--shadow-sm)]"
            style={{ padding: 'var(--space-xs)' }}
          >
            <div className="grid grid-cols-2 gap-[var(--space-md)] lg:grid-cols-4 lg:gap-0">
              {summary.cards.map((item, index) => (
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

          <section className="flex flex-col gap-[var(--space-md)]">
            <div className="flex items-center justify-between gap-[var(--space-sm)]">
              <h2 className="type-heading-h6 text-[var(--color-text)]">My Tasks</h2>
              <Button variant="primary" size="sm" onClick={() => router.push('/my-tasks')}>
                View All Tasks
              </Button>
            </div>

            {loadingWorkflows ? (
              <p className="type-body-sm text-[var(--color-text-body)]">Loading tasks...</p>
            ) : summary.visibleRows.length === 0 ? (
              <p className="type-body-sm text-[var(--color-text-body)]">
                No tasks found yet. Start a new application to begin.
              </p>
            ) : (
              <div className="flex flex-col gap-[var(--space-sm)]">
                {[
                  {
                    id: 'task-complete-submission',
                    title: 'Complete submission',
                    detail: `${summary.visibleRows[0]?.permitNumber ?? 'Draft'} · Application package`,
                    ctaLabel: 'Resume',
                    onClick: () => router.push('/my-applications'),
                  },
                  ...summary.visibleRows.slice(0, 2).map((row) => ({
                    id: `task-${row.id}`,
                    title: `Review status for ${row.permitNumber}`,
                    detail: row.title,
                    ctaLabel: 'Open',
                    onClick: () => router.push(`/applications/${row.permitNumber}`),
                  })),
                ].slice(0, 3).map((task) => {
                  return (
                  <div
                    key={task.id}
                    className="flex flex-col gap-[var(--space-sm)] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] md:flex-row md:items-center md:justify-between"
                    style={{
                      paddingInlineStart: 'var(--space-md, 16px)',
                      paddingInlineEnd: 'var(--space-lg, 24px)',
                      paddingBlock: 'var(--space-md, 16px)',
                    }}
                  >
                    <div className="md:pr-[var(--space-xl)]">
                      <p className="type-body-sm text-[var(--color-text)]">{task.title}</p>
                      <p className="mt-[var(--space-2xs)] type-body-xs text-[var(--color-text-body)]">{task.detail}</p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={task.onClick}
                    >
                      {task.ctaLabel}
                    </Button>
                  </div>
                  );
                })}
              </div>
            )}

          </section>

          {guidanceSubmission ? (
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
                <p className="type-body-sm text-[var(--color-text)]">{guidanceSubmission.title} submitted</p>
                <p className="type-body-xs text-[var(--color-text-body)]">
                  Submitted {new Date(guidanceSubmission.submittedAt).toLocaleString()}
                </p>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </WorkspaceShell>
  );
}
