'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Circle, Clock3, Download, ExternalLink, Eye, FileText, MoveLeft } from 'lucide-react';
import { Badge, type BadgeColor, Button, Progress, Tabs } from 'usds';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { LucideIcon } from '@/components/LucideIcon';

import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';
import type { Project, ProcessInstance, CaseEvent, Document } from '@/types/pic';

type Props = {
  projectId: string;
};

const PROJECT_NUMBERS: Record<string, string> = {
  '1': 'C910-04-3198',
  '2': 'C710-04-3238',
  '3': 'C510-04-3277',
};

/* ------------------------------------------------------------------ */
/*  PIC-typed mock data — Elk Basin Natural Gas Pipeline               */
/* ------------------------------------------------------------------ */

const PROJECT: Project = {
  id: 1,
  title: 'Elk Basin Natural Gas Pipeline Right-of-Way',
  description:
    'Construction of a 28-mile natural gas gathering pipeline crossing BLM-managed public lands in Park County, WY, connecting the Elk Basin field to the regional transmission network.',
  sponsor: 'Rocky Mountain Gas Gathering LLC',
  lead_agency: 'Bureau of Land Management',
  sector: 'Energy',
  type: 'Natural Gas Pipeline',
  current_status: 'underway',
  start_date: '2025-02-20',
  location_text: 'T57N R100W, Sec 4-22, Park County, WY',
  location_lat: 44.9941,
  location_lon: -108.8765,
  other: {
    formType: 'SF-299',
    applicantOrganization: 'Rocky Mountain Gas Gathering LLC',
    contactName: 'James Parker',
    contactEmail: 'jparker@rmgathering.com',
    corridorLengthMiles: '28',
    stateCode: 'WY',
    legalAuthority: '43 CFR 2800 – Rights-of-Way',
  },
};

/* -- Required forms / reviews (ProcessInstances) -- */

const FORMS_REVIEWS: ProcessInstance[] = [
  {
    id: 1,
    parent_project_id: 1,
    type: 'Permit Application',
    status: 'completed',
    stage: 'Submitted',
    lead_agency: 'Bureau of Land Management',
    start_date: '2025-02-20',
    complete_date: '2025-02-20',
    description: 'SF-299 Right-of-Way Application',
    agency_id: 'SF-299',
  },
  {
    id: 2,
    parent_project_id: 1,
    type: 'Categorical Exclusion',
    status: 'underway',
    stage: 'Under Review',
    lead_agency: 'Bureau of Land Management',
    start_date: '2025-03-15',
    description: 'Categorical Exclusion Determination (CX)',
    agency_id: 'CX',
  },
  {
    id: 3,
    parent_project_id: 1,
    type: 'Environmental Review',
    status: 'planned',
    stage: 'Conditional',
    lead_agency: 'Bureau of Land Management',
    description: 'NEPA Environmental Assessment',
    agency_id: 'NEPA-EA',
  },
  {
    id: 4,
    parent_project_id: 1,
    type: 'Water Permit',
    status: 'planned',
    stage: 'Not Started',
    lead_agency: 'U.S. Army Corps of Engineers',
    description: 'Section 404 Clean Water Act Permit',
    agency_id: 'USACE-404',
  },
  {
    id: 5,
    parent_project_id: 1,
    type: 'Consultation',
    status: 'planned',
    stage: 'Not Started',
    lead_agency: 'U.S. Fish & Wildlife Service',
    description: 'Threatened & Endangered Species Consultation (Section 7)',
    agency_id: 'ESA-S7',
  },
];

/* -- Project-level milestones (CaseEvents) -- */

const CASE_EVENTS: CaseEvent[] = [
  {
    id: 0,
    parent_process_id: 1,
    name: 'Project Registered',
    type: 'Initiation',
    tier: 1,
    status: 'completed',
    datetime: '2025-02-10T00:00:00Z',
    assigned_entity: 'Applicant',
    description: 'Project added to PERMIT.GOV via intake questionnaire',
    following_segment_name: 'Application Submission',
  },
  {
    id: 1,
    parent_process_id: 1,
    name: 'Forms Submitted',
    type: 'Submission',
    tier: 1,
    status: 'completed',
    datetime: '2025-02-20T00:00:00Z',
    assigned_entity: 'Applicant',
    description: 'SF-299 Right-of-Way application submitted for review',
    following_segment_name: 'Environmental Review',
  },
  {
    id: 3,
    parent_process_id: 1,
    name: 'Environmental Review',
    type: 'EA',
    tier: 1,
    status: 'in progress',
    datetime: '2025-05-28T00:00:00Z',
    assigned_entity: 'BLM NEPA Team',
    description: 'Draft Environmental Assessment in preparation',
    following_segment_name: 'Public Comment',
  },
  {
    id: 4,
    parent_process_id: 1,
    name: 'Public Comment',
    type: 'Engagement',
    tier: 1,
    status: 'pending',
    datetime: '2025-08-01T00:00:00Z',
    assigned_entity: 'BLM Public Affairs',
    description: '30-day public comment period on Draft EA',
    following_segment_name: 'Final Review',
  },
  {
    id: 5,
    parent_process_id: 1,
    name: 'Final Review',
    type: 'Consultation',
    tier: 1,
    status: 'pending',
    datetime: '2025-09-15T00:00:00Z',
    assigned_entity: 'USACE / USFWS',
    description: 'Section 404 permit and ESA Section 7 consultation',
    following_segment_name: 'Authorization Decision',
  },
  {
    id: 6,
    parent_process_id: 1,
    name: 'Authorization Decision',
    type: 'Decision',
    tier: 1,
    status: 'pending',
    datetime: '2025-11-01T00:00:00Z',
    assigned_entity: 'BLM Authorized Officer',
    description: 'Final right-of-way grant authorization or denial',
  },
];

/* -- Documents -- */

const DOCUMENTS: Document[] = [
  {
    id: 1,
    parent_process_id: 1,
    document_type: 'Application',
    title: 'SF-299 Right-of-Way Application',
    prepared_by: 'Rocky Mountain Gas Gathering LLC',
    status: 'Complete',
    publish_date: '2025-02-20',
    public_access: true,
  },
  {
    id: 2,
    parent_process_id: 1,
    document_type: 'Letter',
    title: 'Completeness Determination Letter',
    prepared_by: 'BLM Realty Specialist',
    status: 'Complete',
    publish_date: '2025-03-10',
    public_access: true,
  },
  {
    id: 3,
    parent_process_id: 2,
    document_type: 'EA',
    title: 'Draft Environmental Assessment',
    prepared_by: 'BLM NEPA Team',
    status: 'In Progress',
    public_access: false,
  },
  {
    id: 4,
    parent_process_id: 1,
    document_type: 'Map',
    title: 'Pipeline Route & Corridor Map',
    prepared_by: 'Rocky Mountain Gas Gathering LLC',
    status: 'Complete',
    publish_date: '2025-02-20',
    public_access: true,
  },
];

/* -- Applicant tasks (user-owned action items) -- */

type ApplicantTask = {
  id: number;
  name: string;
  status: 'complete' | 'in-progress' | 'not-started' | 'overdue';
  dueDate?: string;
  submittedDate?: string;
};

const APPLICANT_TASKS: ApplicantTask[] = [
  {
    id: 1,
    name: 'Submit SF-299 Application',
    status: 'complete',
    dueDate: '2025-02-20',
    submittedDate: '2025-02-18',
  },
  {
    id: 2,
    name: 'Upload Biological Survey Report',
    status: 'complete',
    dueDate: '2025-03-05',
    submittedDate: '2025-03-02',
  },
  {
    id: 3,
    name: 'Upload Cultural Resource Survey',
    status: 'in-progress',
    dueDate: '2025-06-15',
  },
  {
    id: 4,
    name: 'Respond to Information Request (RFI)',
    status: 'overdue',
    dueDate: '2025-07-01',
  },
  {
    id: 5,
    name: 'Review & Sign ROW Grant',
    status: 'not-started',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type StepState = 'complete' | 'in-progress' | 'not-started' | 'overdue';

function deriveStepState(event: CaseEvent): StepState {
  if (event.status === 'completed') return 'complete';
  if (event.status === 'in progress') return 'in-progress';
  return 'not-started';
}

function deriveFormState(pi: ProcessInstance): StepState {
  if (pi.status === 'completed') return 'complete';
  if (pi.status === 'underway') return 'in-progress';
  return 'not-started';
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getStatusMeta(state: StepState): { label: string; badgeColor: BadgeColor } {
  if (state === 'complete') return { label: 'COMPLETE', badgeColor: 'green' };
  if (state === 'in-progress') return { label: 'IN PROGRESS', badgeColor: 'blue' };
  if (state === 'overdue') return { label: 'OVERDUE', badgeColor: 'red' };
  return { label: 'NOT STARTED', badgeColor: 'steel' };
}

function getFormStatusMeta(pi: ProcessInstance, state: StepState): { label: string; badgeColor: BadgeColor } {
  if (state === 'complete') {
    return pi.type === 'Permit Application'
      ? { label: 'SUBMITTED', badgeColor: 'green' }
      : { label: 'APPROVED', badgeColor: 'green' };
  }
  if (state === 'in-progress') return { label: 'IN REVIEW', badgeColor: 'blue' };
  return { label: 'NOT STARTED', badgeColor: 'steel' };
}

const completedForms = FORMS_REVIEWS.filter((f) => f.status === 'completed').length;
const completedMilestones = CASE_EVENTS.filter((e) => e.status === 'completed').length;
const completedTasks = APPLICANT_TASKS.filter((t) => t.status === 'complete').length;
const nextApplicantTasks = APPLICANT_TASKS.filter((t) => t.status !== 'complete').slice(0, 1);

/* ------------------------------------------------------------------ */
/*  Detail fields                                                      */
/* ------------------------------------------------------------------ */

const other = PROJECT.other as Record<string, string>;

const DETAIL_FIELDS: { label: string; value: string }[] = [
  { label: 'Applicant Organization', value: other.applicantOrganization },
  { label: 'Contact Name', value: other.contactName },
  { label: 'Contact Email', value: other.contactEmail },
  { label: 'Project Location', value: PROJECT.location_text ?? '—' },
  { label: 'State', value: other.stateCode },
  { label: 'Corridor Length', value: `${other.corridorLengthMiles} miles` },
  { label: 'Sector / Type', value: `${PROJECT.sector} · ${PROJECT.type}` },
  { label: 'Lead Agency', value: PROJECT.lead_agency ?? '—' },
  { label: 'Date Initiated', value: formatDate(PROJECT.start_date) },
  { label: 'Legal Authority', value: other.legalAuthority },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProjectDetailClient({ projectId }: Props) {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  if (!token) return null;

  /* ── Tab content builders ── */

  const overviewContent = (
    <div className="flex flex-col" style={{ gap: 'var(--space-md, 16px)' }}>
      {/* ── Current Status ── */}
      <section
        className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]"
        style={{ background: 'var(--color-bg-subtle, var(--color-bg))' }}
      >
        {/* ── Overall Status — pizza tracker ── */}
        <div style={{ padding: 'var(--space-md, 16px)' }}>
          <div className="flex flex-col" style={{ gap: 'var(--space-sm, 8px)' }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 'var(--font-size-body-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-body)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</span>
              <span className="type-body-xs text-[var(--color-text-disabled)]">
                Step {completedMilestones + (CASE_EVENTS.some((e) => e.status === 'in progress') ? 1 : 0)} of {CASE_EVENTS.length}
              </span>
            </div>

          </div>
        </div>
        <div className="overflow-x-auto" style={{ padding: 'var(--space-lg, 24px) var(--space-md, 16px) var(--space-xl, 24px)' }}>
          <div className="min-w-[700px]">
            <div className="relative flex items-start">
              {/* Connector lines layer — sits behind the circles */}
              <div className="pointer-events-none absolute inset-x-0 flex" style={{ top: 17 }}>
                {CASE_EVENTS.map((_, idx) => {
                  if (idx === 0) return null;
                  const firstIncomplete = CASE_EVENTS.findIndex((e) => e.status !== 'completed');
                  const filled = firstIncomplete === -1 ? true : idx <= firstIncomplete;
                  // Each segment spans from center of circle[idx-1] to center of circle[idx]
                  const segLeft = ((idx - 1) + 0.5) / CASE_EVENTS.length * 100;
                  const segRight = (idx + 0.5) / CASE_EVENTS.length * 100;
                  return (
                    <span
                      key={idx}
                      className="absolute"
                      style={{
                        left: `${segLeft}%`,
                        width: `${segRight - segLeft}%`,
                        height: 2,
                        background: filled ? 'var(--color-text)' : 'var(--color-border)',
                      }}
                      aria-hidden="true"
                    />
                  );
                })}
              </div>
              {CASE_EVENTS.map((event, idx) => {
                const state = deriveStepState(event);
                const isCompleted = state === 'complete';
                const isActive = state === 'in-progress';
                return (
                  <div key={event.id} className="relative z-10 flex flex-col items-center" style={{ width: 0, flex: '1 1 0%' }}>
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                      style={{
                        background: isCompleted || isActive ? 'var(--color-text)' : 'var(--color-bg)',
                        border: isCompleted || isActive ? 'none' : '2px solid var(--color-border)',
                        color: isCompleted || isActive ? 'var(--color-bg)' : 'var(--color-text-disabled)',
                      }}
                      aria-hidden="true"
                    >
                      {isCompleted ? <LucideIcon icon={Check} size={16} /> : isActive ? <LucideIcon icon={Clock3} size={14} /> : <LucideIcon icon={Circle} size={6} />}
                    </span>
                    <p
                      className="text-center type-body-xs"
                      style={{
                        marginTop: 'var(--space-sm, 8px)',
                        color: isActive || isCompleted ? 'var(--color-text)' : 'var(--color-text-disabled)',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {event.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--color-border)' }} />

        {/* ── Tasks ── */}
        <div style={{ padding: 'var(--space-md, 16px)' }}>
          <div className="flex flex-col" style={{ gap: 'var(--space-sm, 8px)' }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 'var(--font-size-body-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-body)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tasks</span>
              <span className="type-body-xs text-[var(--color-text-disabled)]">
                {completedTasks} of {APPLICANT_TASKS.length} complete
                <span style={{ margin: '0 var(--space-2xs, 4px)' }}>|</span>
                <button
                  type="button"
                  onClick={() => {
                    const tabs = document.querySelectorAll('.tab');
                    tabs.forEach((t) => {
                      if (t.textContent?.toLowerCase().includes('tasks')) (t as HTMLElement).click();
                    });
                  }}
                  className="type-body-xs text-[var(--color-text-disabled)] hover:underline"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  View all
                </button>
              </span>
            </div>
            {nextApplicantTasks.length > 0 && (() => {
              const task = nextApplicantTasks[0];
              const meta = getStatusMeta(task.status);
              return (
                <div className="flex flex-col" style={{ gap: 'var(--space-xs, 6px)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: 'var(--space-sm, 8px)' }}>
                      <Badge color={meta.badgeColor} size="sm">{meta.label}</Badge>
                      <span className="type-body-sm text-[var(--color-text)]">{task.name}</span>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => { window.location.hash = `task-${task.id}`; }}
                    >
                      {task.status === 'in-progress' ? 'Continue' : 'Start'}
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg-subtle, var(--color-bg))' }}>
        <table className="table w-full">
          <thead>
            <tr><th>Project Details</th></tr>
          </thead>
        </table>
        <dl
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ padding: 'var(--space-md, 16px)', gap: 'var(--space-sm, 8px) var(--space-lg, 24px)' }}
        >
          {DETAIL_FIELDS.map((f) => (
            <div key={f.label} className="flex flex-col" style={{ gap: 'var(--space-3xs, 2px)' }}>
              <dt className="type-body-xs text-[var(--color-text-disabled)]">{f.label}</dt>
              <dd className="type-body-sm text-[var(--color-text)]">{f.value}</dd>
            </div>
          ))}
        </dl>
        <div style={{ padding: '0 var(--space-md, 16px) var(--space-md, 16px)' }}>
          <p className="type-body-xs text-[var(--color-text-disabled)]" style={{ lineHeight: 1.6 }}>
            {PROJECT.description}
          </p>
        </div>
      </section>
    </div>
  );

  const formsContent = (
    <div className="flex flex-col" style={{ gap: 'var(--space-md, 16px)' }}>
      <div className="flex items-center justify-between">
        <span className="type-body-xs text-[var(--color-text-disabled)]">
          {completedForms} of {FORMS_REVIEWS.length} approvals complete
        </span>
      </div>
      {FORMS_REVIEWS.map((form, idx) => {
        const state = deriveFormState(form);
        const meta = getFormStatusMeta(form, state);
        const isConditional = form.agency_id === 'NEPA-EA';
        const displayMeta = isConditional ? { label: 'CONDITIONAL', badgeColor: 'steel' as BadgeColor } : meta;
        return (
          <div key={form.id}>
            <section
              className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]"
              style={{ background: 'var(--color-bg-subtle, var(--color-bg))', padding: 'var(--space-md, 16px)', opacity: isConditional ? 0.5 : 1 }}
            >
              <div className="flex items-start" style={{ gap: 'var(--space-sm, 8px)' }}>
                {/* Status indicator icon */}
                <span
                  className="flex shrink-0 items-center justify-center"
                  style={{
                    width: 24,
                    height: 24,
                    marginTop: 1,
                    color: state === 'complete'
                      ? 'var(--color-text)'
                      : state === 'in-progress'
                        ? 'var(--color-text)'
                        : 'var(--color-text-disabled)',
                  }}
                  aria-hidden="true"
                >
                  {state === 'complete'
                    ? <LucideIcon icon={Check} size={18} />
                    : state === 'in-progress'
                      ? <LucideIcon icon={Clock3} size={16} />
                      : <LucideIcon icon={Circle} size={14} />}
                </span>
                {/* Content */}
                <div className="flex flex-1 flex-col" style={{ gap: 'var(--space-3xs, 2px)' }}>
                  <div className="flex items-center justify-between">
                    <p className="type-body-sm font-semibold text-[var(--color-text)]">{form.description}</p>
                    <Badge color={displayMeta.badgeColor} size="sm">{displayMeta.label}</Badge>
                  </div>
                  <p className="type-body-xs text-[var(--color-text-disabled)]">
                    {form.type} · {form.lead_agency}
                  </p>
                  <div className="flex items-center type-body-xs text-[var(--color-text-disabled)]" style={{ gap: 'var(--space-md, 16px)', marginTop: 'var(--space-3xs, 2px)' }}>
                    {form.start_date && (
                      <span>Started: {formatDate(form.start_date)}</span>
                    )}
                    {form.complete_date && (
                      <span>{form.type === 'Permit Application' ? 'Submitted' : 'Approved'}: {formatDate(form.complete_date)}</span>
                    )}
                    {!form.start_date && !form.complete_date && (
                      <span>Not yet scheduled</span>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );

  const tasksContent = (
    <div>
      {/* ── Desktop table ── */}
      <div className="hidden md:block">
        <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg)' }}>
          <div className="overflow-x-auto">
            <table className="table min-w-[700px]">
              <thead>
                <tr>
                  <th className="w-10"></th>
                  <th className="w-auto">Task</th>
                  <th className="w-36">Due Date</th>
                  <th className="w-36">Submitted</th>
                  <th className="w-28">Status</th>
                  <th className="w-28"></th>
                </tr>
              </thead>
              <tbody>
                {APPLICANT_TASKS.map((task) => {
                  const meta = getStatusMeta(task.status);
                  return (
                    <tr key={task.id}>
                      <td>
                        {task.status === 'complete' ? (
                          <LucideIcon icon={Check} size={16} style={{ color: 'var(--color-text)' }} />
                        ) : (
                          <span style={{ display: 'inline-block', width: 16 }} />
                        )}
                      </td>
                      <td className="type-body-sm">{task.name}</td>
                      <td className="type-body-sm">{task.dueDate ? formatDate(task.dueDate) : '—'}</td>
                      <td className="type-body-sm">{task.submittedDate ? formatDate(task.submittedDate) : '—'}</td>
                      <td><Badge color={meta.badgeColor} size="sm">{meta.label}</Badge></td>
                      <td>
                        {task.status !== 'complete' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => { window.location.hash = `task-${task.id}`; }}
                          >
                            {task.status === 'in-progress' ? 'Continue' : 'Start'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Mobile cards ── */}
      <div className="flex flex-col gap-[var(--space-sm)] md:hidden">
        {APPLICANT_TASKS.map((task) => {
          const meta = getStatusMeta(task.status);
          return (
            <div
              key={task.id}
              className="flex flex-col gap-[var(--space-xs)] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)]"
              style={{ padding: 'var(--space-md)' }}
            >
              <div className="flex items-start justify-between gap-[var(--space-sm)]">
                <div className="flex items-center gap-[var(--space-xs)]">
                  {task.status === 'complete' && <LucideIcon icon={Check} size={14} style={{ color: 'var(--color-text)' }} />}
                  <p className="type-body-sm font-medium text-[var(--color-text)]">{task.name}</p>
                </div>
                <Badge color={meta.badgeColor} size="sm">{meta.label}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="type-body-xs text-[var(--color-text-disabled)]">
                  {task.dueDate ? `Due ${formatDate(task.dueDate)}` : ''}
                  {task.submittedDate ? ` · Submitted ${formatDate(task.submittedDate)}` : ''}
                </p>
                {task.status !== 'complete' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => { window.location.hash = `task-${task.id}`; }}
                  >
                    {task.status === 'in-progress' ? 'Continue' : 'Start'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="type-body-xs text-[var(--color-text-disabled)]" style={{ paddingTop: 'var(--space-sm, 8px)' }}>
        Showing 1-{APPLICANT_TASKS.length} of {APPLICANT_TASKS.length} tasks
      </div>
    </div>
  );

  const documentsContent = (
    <div>
      {/* ── Desktop table ── */}
      <div className="hidden md:block">
        <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg)' }}>
          <div className="overflow-x-auto">
            <table className="table min-w-[780px]">
              <thead>
                <tr>
                  <th className="w-auto">Documents</th>
                  <th className="w-28">Type</th>
                  <th className="w-36">Submitted</th>
                  <th className="w-24">Access</th>
                  <th className="w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {DOCUMENTS.map((doc) => (
                  <tr key={doc.id}>
                    <td className="type-body-sm">{doc.title}</td>
                    <td className="type-body-sm">{doc.document_type}</td>
                    <td className="type-body-sm">{formatDate(doc.publish_date)}</td>
                    <td className="type-body-sm">{doc.public_access ? 'Public' : 'Internal'}</td>
                    <td>
                      <div className="flex items-center" style={{ gap: 'var(--space-sm, 8px)' }}>
                        {doc.status === 'Complete' && (
                          <>
                            <Link href={`#view-${doc.id}`} className="text-[var(--color-text-body)] hover:text-[var(--color-text)]" aria-label={`View ${doc.title}`}>
                              <LucideIcon icon={Eye} size={14} />
                            </Link>
                            <Link href={`#download-${doc.id}`} className="text-[var(--color-text-body)] hover:text-[var(--color-text)]" aria-label={`Download ${doc.title}`}>
                              <LucideIcon icon={Download} size={14} />
                            </Link>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Mobile cards ── */}
      <div className="flex flex-col gap-[var(--space-sm)] md:hidden">
        {DOCUMENTS.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col gap-[var(--space-xs)] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)]"
            style={{ padding: 'var(--space-md)' }}
          >
            <div className="flex items-start justify-between gap-[var(--space-sm)]">
              <p className="type-body-sm font-medium text-[var(--color-text)]">{doc.title}</p>
              <Badge color={doc.status === 'Complete' ? 'green' : 'blue'} size="sm">
                {doc.status === 'Complete' ? 'COMPLETE' : 'IN PROGRESS'}
              </Badge>
            </div>
            <p className="type-body-xs text-[var(--color-text-disabled)]">
              {doc.document_type} · {formatDate(doc.publish_date)} · {doc.public_access ? 'Public' : 'Internal'}
            </p>
            {doc.status === 'Complete' && (
              <div className="flex items-center" style={{ gap: 'var(--space-sm, 8px)' }}>
                <Link href={`#view-${doc.id}`} className="text-[var(--color-text-body)] hover:text-[var(--color-text)]" aria-label={`View ${doc.title}`}>
                  <LucideIcon icon={Eye} size={14} />
                </Link>
                <Link href={`#download-${doc.id}`} className="text-[var(--color-text-body)] hover:text-[var(--color-text)]" aria-label={`Download ${doc.title}`}>
                  <LucideIcon icon={Download} size={14} />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  /* ── Activity Feed ── */
  type ActivityItem = {
    date: string;
    title: string;
    detail: string;
    actor: string;
    kind: 'milestone' | 'task' | 'form' | 'document';
    status: StepState;
  };

  const activityItems: ActivityItem[] = [
    ...CASE_EVENTS.filter((e) => e.status !== 'pending').map((e) => ({
      date: e.datetime,
      title: e.name,
      detail: e.description ?? '',
      actor: e.assigned_entity ?? '',
      kind: 'milestone' as const,
      status: deriveStepState(e),
    })),
    ...APPLICANT_TASKS.filter((t) => t.submittedDate).map((t) => ({
      date: t.submittedDate!,
      title: t.name,
      detail: 'Task completed',
      actor: 'Applicant',
      kind: 'task' as const,
      status: 'complete' as StepState,
    })),
    ...FORMS_REVIEWS.filter((f) => f.start_date || f.complete_date).map((f) => ({
      date: (f.complete_date ?? f.start_date)!,
      title: f.description ?? '',
      detail: `${f.type} · ${f.lead_agency}`,
      actor: f.lead_agency,
      kind: 'form' as const,
      status: deriveFormState(f),
    })),
    ...DOCUMENTS.filter((d) => d.status === 'Complete' && d.publish_date).map((d) => ({
      date: d.publish_date!,
      title: d.title,
      detail: d.document_type,
      actor: d.prepared_by,
      kind: 'document' as const,
      status: 'complete' as StepState,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const activityIcon = (kind: ActivityItem['kind']) => {
    switch (kind) {
      case 'milestone': return Circle;
      case 'task': return Check;
      case 'form': return FileText;
      case 'document': return Download;
    }
  };

  const activityDotColor = (status: StepState) => {
    if (status === 'complete') return 'var(--color-success, #10b981)';
    if (status === 'in-progress') return 'var(--color-info, #3b82f6)';
    if (status === 'overdue') return 'var(--color-error, #ef4444)';
    return 'var(--color-text-disabled)';
  };

  const activityContent = (
    <div className="flex flex-col" style={{ gap: 0 }}>
      {activityItems.map((item, idx) => (
        <div key={`${item.kind}-${item.date}-${idx}`} className="flex" style={{ gap: 'var(--space-md, 16px)' }}>
          {/* ── Timeline column ── */}
          <div className="flex flex-col items-center" style={{ width: 24, flexShrink: 0 }}>
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 24, height: 24, backgroundColor: activityDotColor(item.status) }}
            >
              <LucideIcon icon={activityIcon(item.kind)} size={12} style={{ color: '#fff' }} />
            </div>
            {idx < activityItems.length - 1 && (
              <div className="flex-1" style={{ width: 2, backgroundColor: 'var(--color-border)', minHeight: 24 }} />
            )}
          </div>
          {/* ── Content ── */}
          <div className="flex-1" style={{ paddingBottom: 'var(--space-md, 16px)' }}>
            <p className="type-body-xs text-[var(--color-text-disabled)]">{formatDate(item.date)}</p>
            <p className="type-body-sm font-medium text-[var(--color-text)]">{item.title}</p>
            <p className="type-body-xs text-[var(--color-text-body)]">{item.detail}</p>
            <p className="type-body-xs text-[var(--color-text-disabled)]">{item.actor}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <WorkspaceShell
      role={user?.role}
      userSub={user?.sub}
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      <PortalPageScaffold title="">
        <div className="flex flex-col" style={{ gap: 'var(--space-md, 16px)' }}>

          {/* ── Back link ── */}
          <div>
            <Link href="/a/my-projects" className="inline-flex items-center gap-2 type-body-sm text-[var(--color-text-body)] hover:text-[var(--color-text)]">
              <LucideIcon icon={MoveLeft} size={16} />
              My Projects
            </Link>
          </div>

          {/* ── Header ── */}
          <div className="flex items-end justify-between" style={{ gap: 'var(--space-sm, 8px)' }}>
            <div className="flex flex-col" style={{ gap: 'var(--space-2xs, 4px)' }}>
              <h2 className="type-heading-h4 text-[var(--color-text)]">{PROJECT.title}</h2>
              <div className="flex items-center" style={{ gap: 'var(--space-sm, 8px)' }}>
                <p className="type-body-sm text-[var(--color-text-disabled)]">{PROJECT_NUMBERS[projectId] ?? `PRJ-${projectId}`}</p>
                <Badge color="steel" size="sm">SF-299</Badge>
                <Badge color="steel" size="sm">BLM</Badge>
                <Badge color="steel" size="sm">ENERGY</Badge>
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
            <Tabs
              defaultTab="overview"
              items={[
                { id: 'overview', label: 'Overview', content: overviewContent },
                { id: 'forms', label: `Forms & Reviews (${FORMS_REVIEWS.length})`, content: formsContent },
                { id: 'tasks', label: `Tasks (${APPLICANT_TASKS.length})`, content: tasksContent },
                { id: 'documents', label: `Documents (${DOCUMENTS.length})`, content: documentsContent },
                { id: 'activity', label: `Activity (${activityItems.length})`, content: activityContent },
              ]}
            />

        </div>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
