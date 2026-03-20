// My Applications page - copies the table from DashboardPage
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, ApplicantDisplayRow } from '@/components/Table';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, type NotificationPayload } from '@/hooks/useNotifications';
import * as api from '@/lib/api';

// --- Copy of dashboard logic ---
// ...existing code...

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
]; // All dates are static strings

function toTitleCase(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatPermitNumber(id: number): string {
  return `C${String(id).padStart(8, '0')}`;
}

// ...existing code...

export default function MyApplicationsPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [workflows, setWorkflows] = useState<api.WorkflowStatus[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
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
      // Refresh list on any workflow update
      if (token) {
        api.listWorkflows(token).then(setWorkflows).catch(() => {});
      }
    },
  });
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
          <h6 className="type-heading-h6">My Applications</h6>
          <p>You do not have applicant access.</p>
        </div>
      )}
    </WorkspaceShell>
  );
}
