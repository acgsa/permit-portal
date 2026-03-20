'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Table, ApplicantDisplayRow } from '@/components/Table';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, type NotificationPayload } from '@/hooks/useNotifications';
import * as api from '@/lib/api';

const STATUS_LABEL: Record<string, string> = {
  running: 'In Progress',
  completed: 'Completed',
  // ... add other statuses as needed ...
};

const STATUS_COLOR: Record<string, string> = {
  running: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
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

// ...existing code...

function SortArrowsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3L10.25 5.5H5.75L8 3Z" fill="currentColor" />
      <path d="M8 13L5.75 10.5H10.25L8 13Z" fill="currentColor" />
    </svg>
  );
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [workflows, setWorkflows] = useState<api.WorkflowStatus[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Redirect unauthenticated visitors
  useEffect(() => {
    if (!token) router.replace('/login');
  }, [token, router]);

  // Load workflows
  useEffect(() => {
    if (!token) return;
    api
      .listWorkflows(token)
      .then(setWorkflows)
      .catch((err: unknown) =>
        setFetchError(err instanceof Error ? err.message : 'Failed to load workflows'),
      )
      .finally(() => setLoadingWorkflows(false));
  }, [token]);

  // Real-time notifications
  useNotifications({
    token,
    onMessage: (payload: NotificationPayload) => {
      const msg = payload.message ?? `Workflow ${payload.workflow_id ?? ''} updated`;
      setNotifications((prev) => [msg, ...prev].slice(0, 5));
      // Refresh list on any workflow update
      if (token) {
        api.listWorkflows(token).then(setWorkflows).catch(() => {});
      }
    },
  });

  const handleStartApplication = async () => {
    if (!token) return;
    try {
      const wf = await api.createWorkflow(token, { process_name: 'permit_process' });
      setWorkflows((prev) => [wf, ...prev]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not start application');
    }
  };

  if (!token) return null;

  const isApplicant = user?.role !== 'staff' && user?.role !== 'admin';
  const applicantRows = [...workflows].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
  const applicantDisplayRows: ApplicantDisplayRow[] = applicantRows.map((wf) => ({
    id: wf.id,
    title: toTitleCase(wf.process_name),
    permitNumber: formatPermitNumber(wf.id),
    statusKey: wf.status === 'completed' ? 'approved' : wf.status === 'error' ? 'rejected' : wf.status === 'running' ? 'in_review' : 'in_progress',
    updatedLabel: 'May 12, 2025', // Static string for prototype
  }));
  const hasMalformedApplicantData = applicantDisplayRows.some(
    (row) => row.title.includes('"detail"') || row.title.includes('Field Required') || row.title.includes('token'),
  );
  const useMockApplicantRows = !!fetchError || hasMalformedApplicantData || applicantDisplayRows.length === 0;
  const visibleApplicantRows = useMockApplicantRows ? APPLICANT_MOCK_ROWS : applicantDisplayRows;
  type ApplicantTableColumn = {
    key: string;
    label: string;
    widthClassName?: string;
    action?: {
      label: string;
      icon: React.ReactNode;
    };
  };
  const applicantColumns: ApplicantTableColumn[] = [
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'permit',
      label: 'Permit #',
      widthClassName: 'w-[220px]',
      action: {
        label: 'Sort by Permit Number',
        icon: <SortArrowsIcon />,
      },
    },
    {
      key: 'status',
      label: 'Status',
      widthClassName: 'w-[220px]',
      action: {
        label: 'Sort by Status',
        icon: <SortArrowsIcon />,
      },
    },
    {
      key: 'updated',
      label: 'Updated',
      widthClassName: 'w-[200px]',
      action: {
        label: 'Sort by Updated Date',
        icon: <SortArrowsIcon />,
      },
    },
  ];

  return (
    <WorkspaceShell
      role={user?.role}
      userSub={user?.sub}
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      {isApplicant ? (
        <Table rows={visibleApplicantRows} showMockNotice={useMockApplicantRows} />
      ) : (
        <div className="w-full space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-steel-500 dark:text-steel-400 mt-1">
              Welcome back, <span className="font-medium text-steel-900 dark:text-white">{user?.sub}</span>
              {user?.role && user.role !== 'applicant' && (
                <span className="ml-2 text-xs uppercase tracking-wider bg-steel-200 dark:bg-steel-800 rounded px-2 py-0.5">
                  {user.role}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleStartApplication}>
              + New Application
            </Button>
          </div>
        </div>

        {/* Live notifications toast strip */}
        {notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map((msg, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                {msg}
              </div>
            ))}
          </div>
        )}

        {/* Workflows */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Applications</h2>

          {loadingWorkflows && (
            <p className="text-steel-500 dark:text-steel-400">Loading…</p>
          )}

          {fetchError && (
            <p className="text-red-600 dark:text-red-400">{fetchError}</p>
          )}

          {!loadingWorkflows && workflows.length === 0 && !fetchError && (
            <Card>
              <p className="text-steel-500 dark:text-steel-400 text-center py-8">
                No applications yet.{' '}
                <button
                  onClick={handleStartApplication}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Start your first application
                </button>
                .
              </p>
            </Card>
          )}

          <div className="space-y-3">
            {workflows.map((wf) => (
              <Card key={wf.id}>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-medium text-steel-900 dark:text-white truncate">
                      {wf.process_name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </p>
                    <p className="text-sm text-steel-500 dark:text-steel-400 mt-0.5">
                      Current step:{' '}
                      <span className="font-medium text-steel-700 dark:text-steel-300">
                        {wf.current_task ?? '—'}
                      </span>
                      {' · '}Started {new Date(wf.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
                      STATUS_COLOR[wf.status] ?? 'bg-steel-100 text-steel-700 dark:bg-steel-800 dark:text-steel-300'
                    }`}
                  >
                    {STATUS_LABEL[wf.status] ?? wf.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick links */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Resources</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Use Cases', href: '/use-cases', desc: 'Browse permit types' },
              { label: 'Help Desk', href: '/dashboard/help-desk', desc: 'Get support' },
              { label: 'Agency Partnerships', href: '/partnerships', desc: 'Coordination tools' },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="h-full hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                  <p className="font-semibold text-steel-900 dark:text-white">{item.label}</p>
                  <p className="text-sm text-steel-500 dark:text-steel-400 mt-1">{item.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        </div>
      )}
    </WorkspaceShell>
  );
}
