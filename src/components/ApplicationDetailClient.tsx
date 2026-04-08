'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Clock3, Download, ExternalLink, FileText, MoveLeft } from 'lucide-react';
import { Badge, type BadgeColor } from 'usds';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { LucideIcon } from '@/components/LucideIcon';
import { AnimatedCard, AnimatedTableRow } from '@/components/motion';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';
import type { Project, ProcessInstance, CaseEvent, Document } from '@/types/pic';

type Props = {
  applicationId: string;
};

/* ------------------------------------------------------------------ */
/*  PIC-typed mock data for a submitted SF-299 Right-of-Way permit    */
/* ------------------------------------------------------------------ */

const PROJECT: Project = {
  id: 1,
  title: 'Sunrise Valley Solar Interconnection Right-of-Way',
  description:
    'Construction of a 12.4-mile overhead transmission line connecting the Sunrise Valley Solar facility to the regional grid, crossing BLM-managed public lands in Clark County, NV.',
  sponsor: 'Sunrise Valley Energy LLC',
  lead_agency: 'Bureau of Land Management',
  sector: 'Energy',
  type: 'Right-of-Way (SF-299)',
  current_status: 'underway',
  start_date: '2025-03-15',
  location_text: 'T12N R8E, Sec 14-23, Clark County, NV',
  location_lat: 36.1699,
  location_lon: -115.1398,
  other: {
    formType: 'SF-299',
    applicantOrganization: 'Sunrise Valley Energy LLC',
    contactName: 'Jane Mitchell',
    contactEmail: 'jane.mitchell@sunrisevalley.com',
    corridorLengthMiles: '12.4',
    stateCode: 'NV',
    legalAuthority: '43 CFR 2800 – Rights-of-Way',
  },
};

const PROCESS: ProcessInstance = {
  id: 1,
  parent_project_id: 1,
  type: 'SF-299 Right-of-Way Authorization',
  status: 'underway',
  stage: 'Environmental Assessment',
  lead_agency: 'Bureau of Land Management',
  start_date: '2025-03-15',
  purpose_need:
    'Authorization of a right-of-way grant across public lands for the construction, operation, and maintenance of an electrical transmission line.',
};

const CASE_EVENTS: CaseEvent[] = [
  {
    id: 1,
    parent_process_id: 1,
    name: 'Application Submitted',
    type: 'Submission',
    tier: 1,
    status: 'completed',
    datetime: '2025-03-15T00:00:00Z',
    assigned_entity: 'Applicant',
    description: 'SF-299 application form submitted via PERMIT.GOV',
    following_segment_name: 'Completeness Review',
  },
  {
    id: 2,
    parent_process_id: 1,
    name: 'Completeness Review',
    type: 'Review',
    tier: 1,
    status: 'completed',
    datetime: '2025-04-02T00:00:00Z',
    assigned_entity: 'BLM Realty Specialist',
    description: 'Application reviewed for completeness and sufficiency',
    following_segment_name: 'NEPA Screening',
  },
  {
    id: 3,
    parent_process_id: 1,
    name: 'NEPA Screening',
    type: 'Screening',
    tier: 1,
    status: 'completed',
    datetime: '2025-04-18T00:00:00Z',
    assigned_entity: 'BLM Environmental Coordinator',
    description: 'Environmental screening to determine level of NEPA review required',
    following_segment_name: 'Environmental Assessment',
  },
  {
    id: 4,
    parent_process_id: 1,
    name: 'Environmental Assessment',
    type: 'EA',
    tier: 1,
    status: 'in progress',
    datetime: '2025-05-28T00:00:00Z',
    assigned_entity: 'BLM NEPA Team',
    description: 'Preparation of draft Environmental Assessment per 40 CFR 1501.5',
    following_segment_name: 'Public Comment',
  },
  {
    id: 5,
    parent_process_id: 1,
    name: 'Public Comment Period',
    type: 'Engagement',
    tier: 1,
    status: 'pending',
    datetime: '2025-07-31T00:00:00Z',
    assigned_entity: 'BLM Public Affairs',
    description: '30-day public comment period on Draft EA',
    following_segment_name: 'Fee Assessment',
  },
  {
    id: 6,
    parent_process_id: 1,
    name: 'Fee Assessment & Payment',
    type: 'Fee',
    tier: 1,
    status: 'pending',
    datetime: '2025-08-15T00:00:00Z',
    assigned_entity: 'BLM Realty Specialist',
    description: 'Cost recovery fee assessment and applicant payment processing',
    following_segment_name: 'Authorization Decision',
  },
  {
    id: 7,
    parent_process_id: 1,
    name: 'Authorization Decision',
    type: 'Decision',
    tier: 1,
    status: 'pending',
    datetime: '2025-09-30T00:00:00Z',
    assigned_entity: 'BLM Authorized Officer',
    description: 'Final right-of-way grant authorization or denial',
  },
];

const DOCUMENTS: Document[] = [
  {
    id: 1,
    parent_process_id: 1,
    document_type: 'Application',
    title: 'SF-299 Application Form',
    prepared_by: 'Sunrise Valley Energy LLC',
    status: 'Complete',
    publish_date: '2025-03-15',
    public_access: true,
  },
  {
    id: 2,
    parent_process_id: 1,
    document_type: 'Letter',
    title: 'Completeness Determination Letter',
    prepared_by: 'BLM Realty Specialist',
    status: 'Complete',
    publish_date: '2025-04-02',
    public_access: true,
  },
  {
    id: 3,
    parent_process_id: 1,
    document_type: 'Checklist',
    title: 'NEPA Screening Checklist',
    prepared_by: 'BLM Environmental Coordinator',
    status: 'Complete',
    publish_date: '2025-04-18',
    public_access: false,
  },
  {
    id: 4,
    parent_process_id: 1,
    document_type: 'EA',
    title: 'Draft Environmental Assessment',
    prepared_by: 'BLM NEPA Team',
    status: 'In Progress',
    public_access: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type StepState = 'completed' | 'in-progress' | 'pending';

function getStepState(event: CaseEvent): StepState {
  if (event.status === 'completed') return 'completed';
  if (event.status === 'in progress') return 'in-progress';
  return 'pending';
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getTaskStatusMeta(state: StepState): { label: string; badgeColor: BadgeColor } {
  if (state === 'completed') return { label: 'COMPLETED', badgeColor: 'green' };
  if (state === 'in-progress') return { label: 'IN PROGRESS', badgeColor: 'blue' };
  return { label: 'PENDING', badgeColor: 'gold' };
}

/* ------------------------------------------------------------------ */
/*  Detail fields for the Application Details card                     */
/* ------------------------------------------------------------------ */

const DETAIL_FIELDS: { label: string; value: string }[] = [
  { label: 'Applicant Organization', value: (PROJECT.other as Record<string, string>).applicantOrganization },
  { label: 'Contact Name', value: (PROJECT.other as Record<string, string>).contactName },
  { label: 'Contact Email', value: (PROJECT.other as Record<string, string>).contactEmail },
  { label: 'Project Location', value: PROJECT.location_text ?? '—' },
  { label: 'State', value: (PROJECT.other as Record<string, string>).stateCode },
  { label: 'Corridor Length', value: `${(PROJECT.other as Record<string, string>).corridorLengthMiles} miles` },
  { label: 'Sector / Type', value: `${PROJECT.sector} · ${PROJECT.type}` },
  { label: 'Lead Agency', value: PROJECT.lead_agency ?? '—' },
  { label: 'Date Submitted', value: formatDate(PROJECT.start_date) },
  { label: 'Legal Authority', value: (PROJECT.other as Record<string, string>).legalAuthority },
];

export default function ApplicationDetailClient({ applicationId }: Props) {
  const { user, token, logout } = useAuth();
  const router = useRouter();

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
      <PortalPageScaffold title="">
        <div className="flex flex-col" style={{ gap: 'var(--space-md, 16px)' }}>

          {/* ── Back link ── */}
          <div>
            <Link href="/my-applications" className="inline-flex items-center gap-2 type-body-sm text-[var(--color-text-body)] hover:text-[var(--color-text)]">
              <LucideIcon icon={MoveLeft} size={16} />
              My Applications
            </Link>
          </div>

          {/* ── Header ── */}
          <div className="flex items-end justify-between gap-[var(--space-sm)]">
            <div className="flex flex-col" style={{ gap: 'var(--space-2xs, 4px)' }}>
              <h2 className="type-heading-h4 text-[var(--color-text)]">{PROJECT.title}</h2>
              <div className="flex items-center" style={{ gap: 'var(--space-sm, 8px)' }}>
                <p className="type-body-sm text-[var(--color-text-disabled)]">#{applicationId}</p>
                <Badge color="blue" size="sm">SF-299</Badge>
                <Badge color="steel" size="sm">BLM</Badge>
              </div>
            </div>
            <div className="flex items-center gap-[var(--space-sm)] text-[var(--color-text-body)]">
              <LucideIcon icon={Download} size={16} />
              <LucideIcon icon={FileText} size={16} />
              <LucideIcon icon={ExternalLink} size={16} />
            </div>
          </div>

          {/* ── Application Details ── */}
          <AnimatedCard>
            <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg)' }}>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Application Details</th>
                  </tr>
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
          </AnimatedCard>

          {/* ── Status Tracker ── */}
          <AnimatedCard delay={0.06}>
            <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg)' }}>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Status</th>
                  </tr>
                </thead>
              </table>

              <div className="overflow-x-auto px-[var(--space-md)]" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
                <div className="min-w-[760px]">
                  <div className="flex items-start">
                    {CASE_EVENTS.map((event, idx) => {
                      const state = getStepState(event);
                      const isCompleted = state === 'completed';
                      const isActive = state === 'in-progress';
                      return (
                        <div key={event.id} className="flex flex-1 items-start">
                          <div className="flex w-full flex-col items-center">
                            <span
                              className="flex h-11 w-11 items-center justify-center rounded-full border-2 text-base font-semibold"
                              style={{
                                borderColor: isCompleted
                                  ? 'var(--green-500)'
                                  : isActive
                                    ? 'var(--blue-500, #3B82F6)'
                                    : 'var(--color-border-emphasis)',
                                background: isCompleted ? 'var(--green-500)' : 'transparent',
                                color: isCompleted
                                  ? '#fff'
                                  : isActive
                                    ? 'var(--blue-500, #3B82F6)'
                                    : 'var(--color-text-disabled)',
                              }}
                              aria-hidden="true"
                            >
                              {isCompleted ? (
                                <LucideIcon icon={Check} size={20} />
                              ) : (
                                <LucideIcon icon={Clock3} size={16} />
                              )}
                            </span>
                            <p
                              className="text-center type-body-sm"
                              style={{
                                marginTop: 'var(--space-md, 16px)',
                                color: isActive ? 'var(--blue-500, #3B82F6)' : 'var(--color-text)',
                                fontWeight: isActive ? 600 : 400,
                              }}
                            >
                              {event.name}
                            </p>
                            {isCompleted && (
                              <p className="type-body-xs text-[var(--color-text-disabled)]" style={{ marginTop: 'var(--space-3xs, 2px)' }}>
                                {formatDate(event.datetime)}
                              </p>
                            )}
                          </div>

                          {idx < CASE_EVENTS.length - 1 ? (
                            <span
                              className="mx-[var(--space-2xs)] mt-[22px] h-[2px] flex-1 rounded-full"
                              style={{
                                background:
                                  idx < CASE_EVENTS.findIndex((e) => e.status !== 'completed')
                                    ? 'var(--green-500)'
                                    : 'var(--color-border)',
                              }}
                              aria-hidden="true"
                            />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </AnimatedCard>

          {/* ── Tasks Table ── */}
          <AnimatedCard delay={0.12}>
            <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg)' }}>
              <div className="overflow-x-auto">
                <table className="table min-w-[880px]">
                  <thead>
                    <tr>
                      <th className="w-auto">Task</th>
                      <th className="w-36">Due Date</th>
                      <th className="w-28">Status</th>
                      <th className="w-44">Assigned To</th>
                      <th className="w-32">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CASE_EVENTS.map((event, idx) => {
                      const state = getStepState(event);
                      const statusMeta = getTaskStatusMeta(state);
                      return (
                        <AnimatedTableRow key={event.id} index={idx}>
                          <td className="type-body-sm">{event.description}</td>
                          <td className="type-body-sm">{state === 'pending' ? '—' : formatDate(event.datetime)}</td>
                          <td>
                            <Badge color={statusMeta.badgeColor} size="sm">
                              {statusMeta.label}
                            </Badge>
                          </td>
                          <td className="type-body-sm">{event.assigned_entity}</td>
                          <td className="type-body-sm">{state === 'completed' ? formatDate(event.datetime) : '—'}</td>
                        </AnimatedTableRow>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="type-body-xs text-[var(--color-text-disabled)]" style={{ paddingTop: 'var(--space-sm, 8px)' }}>
              Showing 1-{CASE_EVENTS.length} of {CASE_EVENTS.length} items
            </div>
          </AnimatedCard>

          {/* ── Documents ── */}
          <AnimatedCard delay={0.18}>
            <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg)' }}>
              <div className="overflow-x-auto">
                <table className="table min-w-[780px]">
                  <thead>
                    <tr>
                      <th className="w-auto">Document</th>
                      <th className="w-28">Type</th>
                      <th className="w-28">Status</th>
                      <th className="w-32">Date</th>
                      <th className="w-24">Access</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOCUMENTS.map((doc, idx) => (
                      <AnimatedTableRow key={doc.id} index={idx}>
                        <td className="type-body-sm">{doc.title}</td>
                        <td className="type-body-sm">{doc.document_type}</td>
                        <td>
                          <Badge
                            color={doc.status === 'Complete' ? 'green' : 'blue'}
                            size="sm"
                          >
                            {doc.status === 'Complete' ? 'COMPLETE' : 'IN PROGRESS'}
                          </Badge>
                        </td>
                        <td className="type-body-sm">{formatDate(doc.publish_date)}</td>
                        <td className="type-body-sm">{doc.public_access ? 'Public' : doc.status === 'In Progress' ? '—' : 'Internal'}</td>
                        <td className="text-[var(--color-text-body)]">
                          {doc.status === 'Complete' && <LucideIcon icon={Download} size={14} />}
                        </td>
                      </AnimatedTableRow>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </AnimatedCard>

        </div>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
