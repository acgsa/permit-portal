'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge, type BadgeColor, Button } from 'usds';
import { Check, ChevronDown, ChevronUp, Circle, Clock3, MoveLeft } from 'lucide-react';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { LucideIcon } from '@/components/LucideIcon';
import { useAuth } from '@/contexts/AuthContext';
import {
  FEDERAL_APPLICATION_MOCK_DATA,
  STAFF_SF299_SUBMISSIONS,
  STAFF_PROJECT_NOTES,
  STAFF_APPROVAL_STEPS,
  PAYMENT_MOCK_DATA,
  type SF299SubmissionData,
  type StaffProjectNote,
  type PaymentRecord,
} from '@/lib/mockFederalPortalData';
import type { CaseEvent } from '@/types/pic';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

type StepStatus = 'completed' | 'in progress' | 'pending';

function getStepMeta(status?: string): { label: string; badgeColor: BadgeColor; icon: typeof Check } {
  if (status === 'completed') return { label: 'COMPLETE', badgeColor: 'green', icon: Check };
  if (status === 'in progress') return { label: 'IN PROGRESS', badgeColor: 'blue', icon: Clock3 };
  return { label: 'PENDING', badgeColor: 'steel', icon: Circle };
}

function getAppStatusMeta(status: string): { label: string; badgeColor: BadgeColor } {
  if (status === 'Approved') return { label: 'APPROVED', badgeColor: 'green' };
  if (status === 'In Review') return { label: 'IN REVIEW', badgeColor: 'blue' };
  if (status === 'Pending Interagency') return { label: 'PENDING INTERAGENCY', badgeColor: 'gold' };
  return { label: 'SUBMITTED', badgeColor: 'steel' };
}

function getPaymentStatusMeta(status: PaymentRecord['status']): { label: string; badgeColor: BadgeColor } {
  if (status === 'paid') return { label: 'PAID', badgeColor: 'green' };
  if (status === 'waived') return { label: 'WAIVED', badgeColor: 'steel' };
  return { label: 'PENDING', badgeColor: 'gold' };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function StaffProjectDetailClient({ id }: { id: string }) {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [sf299Expanded, setSf299Expanded] = useState(true);

  useEffect(() => {
    if (!token) router.replace('/f/staff');
  }, [token, router]);

  if (!token) return null;

  const application = FEDERAL_APPLICATION_MOCK_DATA.find((r) => r.id === id);
  if (!application) {
    return (
      <WorkspaceShell role={user?.role} userSub={user?.sub} onSignOut={() => { logout(); router.push('/'); }}>
        <PortalPageScaffold title="">
          <div className="flex flex-col gap-[var(--space-md)]">
            <Link href="/f/projects" className="inline-flex items-center gap-2 type-body-sm text-[var(--color-text-body)] hover:text-[var(--color-text)]">
              <LucideIcon icon={MoveLeft} size={16} /> Projects
            </Link>
            <p className="type-body-sm text-[var(--color-text-disabled)]">Application not found.</p>
          </div>
        </PortalPageScaffold>
      </WorkspaceShell>
    );
  }  const sf299 = STAFF_SF299_SUBMISSIONS[id];
  const notes = STAFF_PROJECT_NOTES[id] ?? [];
  const steps = STAFF_APPROVAL_STEPS[id] ?? [];
  const payment = PAYMENT_MOCK_DATA.find((p) => p.applicationId === id);
  const appStatus = getAppStatusMeta(application.status);

  /* SF-299 fields to display */
  const sf299Fields: { label: string; value: string }[] = sf299
    ? [
        { label: 'Project Title', value: sf299.projectTitle },
        { label: 'Applicant Organization', value: sf299.applicantOrganization },
        { label: 'Contact Name', value: sf299.contactName },
        { label: 'Contact Email', value: sf299.contactEmail },
        { label: 'Project Location', value: sf299.projectLocation },
        { label: 'State', value: sf299.stateCode },
        { label: 'Corridor Length (miles)', value: sf299.corridorLengthMiles || '—' },
        { label: 'Legal Authority', value: sf299.legalAuthority },
        { label: 'Agency', value: application.agency },
        { label: 'Region', value: application.region },
      ]
    : [];

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
        <div className="flex flex-col gap-[var(--space-md)]">

          {/* Back */}
          <Link
            href="/f/projects"
            className="inline-flex items-center gap-2 type-body-sm text-[var(--color-text-body)] hover:text-[var(--color-text)]"
          >
            <LucideIcon icon={MoveLeft} size={16} />
            Projects
          </Link>

          {/* Header */}
          <div className="flex flex-col gap-[var(--space-2xs)]">
            <div className="flex items-center justify-between gap-[var(--space-sm)]">
              <h2 className="type-heading-h4 text-[var(--color-text)]">
                {sf299?.projectTitle ?? application.permitType}
              </h2>
              <Badge color={appStatus.badgeColor} size="sm">{appStatus.label}</Badge>
            </div>
            <div className="flex items-center gap-[var(--space-sm)]">
              <span className="type-body-xs text-[var(--color-text-disabled)]">{application.id}</span>
              <span className="type-body-xs text-[var(--color-text-disabled)]">·</span>
              <span className="type-body-xs text-[var(--color-text-disabled)]">{application.applicantName}</span>
              <span className="type-body-xs text-[var(--color-text-disabled)]">·</span>
              <span className="type-body-xs text-[var(--color-text-disabled)]">{application.agency}</span>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-[var(--space-md)] lg:grid-cols-3">

            {/* ── Left column (col-span-2) ── */}
            <div className="flex flex-col gap-[var(--space-md)] lg:col-span-2">

              {/* SF-299 Submitted Data */}
              {sf299 && (
                <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg-subtle)' }}>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    style={{ padding: 'var(--space-md)' }}
                    onClick={() => setSf299Expanded((v) => !v)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSf299Expanded((v) => !v); }}
                    aria-expanded={sf299Expanded}
                  >
                    <div className="flex items-center gap-[var(--space-sm)]">
                      <p className="type-body-sm font-semibold text-[var(--color-text)]">SF-299 Submitted Application</p>
                      <Badge color="green" size="sm">SUBMITTED</Badge>
                    </div>
                    <div className="flex items-center gap-[var(--space-sm)]">
                      <span className="type-body-xs text-[var(--color-text-disabled)]">
                        {formatDate(sf299.submittedDate)}
                      </span>
                      <LucideIcon icon={sf299Expanded ? ChevronUp : ChevronDown} size={16} style={{ color: 'var(--color-text-disabled)' }} />
                    </div>
                  </div>
                  {sf299Expanded && (
                    <>
                      <div style={{ borderTop: '1px solid var(--color-border)' }} />
                      <div style={{ padding: 'var(--space-md)' }}>
                        <dl
                          className="grid grid-cols-1 md:grid-cols-2"
                          style={{ gap: 'var(--space-sm) var(--space-lg)' }}
                        >
                          {sf299Fields.map((f) => (
                            <div key={f.label} className="flex flex-col" style={{ gap: 'var(--space-3xs)' }}>
                              <dt className="type-body-xs text-[var(--color-text-disabled)]">{f.label}</dt>
                              <dd className="type-body-sm text-[var(--color-text)]">{f.value || '—'}</dd>
                            </div>
                          ))}
                        </dl>
                        {sf299.projectDescription && (
                          <div className="flex flex-col" style={{ gap: 'var(--space-3xs)', marginTop: 'var(--space-sm)' }}>
                            <dt className="type-body-xs text-[var(--color-text-disabled)]">Project Description</dt>
                            <dd className="type-body-sm text-[var(--color-text)]" style={{ lineHeight: 1.6 }}>
                              {sf299.projectDescription}
                            </dd>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </section>
              )}

              {/* Review Checklist */}
              <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg-subtle)' }}>
                <div style={{ padding: 'var(--space-md)' }}>
                  <p className="type-body-sm font-semibold text-[var(--color-text)]">Review Checklist</p>
                  <p className="type-body-xs text-[var(--color-text-disabled)]" style={{ marginTop: 'var(--space-3xs)' }}>
                    {steps.filter((s) => s.status === 'completed').length} of {steps.length} steps complete
                  </p>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)' }} />
                <div className="flex flex-col">
                  {steps.map((step, idx) => {
                    const meta = getStepMeta(step.status);
                    const isLast = idx === steps.length - 1;
                    return (
                      <div
                        key={step.id}
                        className="flex items-start gap-[var(--space-sm)]"
                        style={{
                          padding: 'var(--space-sm) var(--space-md)',
                          borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
                        }}
                      >
                        <span
                          className="flex shrink-0 items-center justify-center rounded-full"
                          style={{
                            width: 24,
                            height: 24,
                            marginTop: 1,
                            background: step.status === 'completed'
                              ? 'var(--color-text)'
                              : step.status === 'in progress'
                                ? 'var(--color-bg)'
                                : 'var(--color-bg)',
                            border: step.status === 'completed'
                              ? 'none'
                              : '2px solid var(--color-border)',
                            color: step.status === 'completed'
                              ? 'var(--color-bg)'
                              : step.status === 'in progress'
                                ? 'var(--color-text)'
                                : 'var(--color-text-disabled)',
                          }}
                        >
                          <LucideIcon
                            icon={step.status === 'completed' ? Check : step.status === 'in progress' ? Clock3 : Circle}
                            size={12}
                          />
                        </span>
                        <div className="flex flex-1 items-start justify-between gap-[var(--space-sm)]">
                          <div className="flex flex-col" style={{ gap: 'var(--space-3xs)' }}>
                            <p className="type-body-sm text-[var(--color-text)]">{step.name}</p>
                            <p className="type-body-xs text-[var(--color-text-disabled)]">{step.description}</p>
                            {step.assigned_entity && (
                              <p className="type-body-xs text-[var(--color-text-disabled)]">Assigned: {step.assigned_entity}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-[var(--space-3xs)] shrink-0">
                            <Badge color={meta.badgeColor} size="sm">{meta.label}</Badge>
                            {step.datetime && (
                              <span className="type-body-xs text-[var(--color-text-disabled)]">{formatDate(step.datetime)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Staff Notes */}
              <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg-subtle)' }}>
                <div style={{ padding: 'var(--space-md)' }}>
                  <p className="type-body-sm font-semibold text-[var(--color-text)]">Staff Notes</p>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)' }} />
                {notes.length === 0 ? (
                  <p className="type-body-sm text-[var(--color-text-disabled)]" style={{ padding: 'var(--space-md)' }}>
                    No notes yet.
                  </p>
                ) : (
                  <div className="flex flex-col">
                    {notes.map((note, idx) => (
                      <div
                        key={note.id}
                        style={{
                          padding: 'var(--space-md)',
                          borderBottom: idx < notes.length - 1 ? '1px solid var(--color-border)' : 'none',
                        }}
                      >
                        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-xs)' }}>
                          <p className="type-body-xs font-semibold text-[var(--color-text)]">{note.author}</p>
                          <p className="type-body-xs text-[var(--color-text-disabled)]">{formatDate(note.date)}</p>
                        </div>
                        <p className="type-body-sm text-[var(--color-text-body)]" style={{ lineHeight: 1.6 }}>{note.body}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ padding: 'var(--space-sm) var(--space-md)', borderTop: '1px solid var(--color-border)' }}>
                  <Button variant="secondary" size="sm" onClick={() => {}}>
                    Add Note
                  </Button>
                </div>
              </section>
            </div>

            {/* ── Right column ── */}
            <div className="flex flex-col gap-[var(--space-md)] lg:col-span-1">

              {/* Assignment card */}
              <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg-subtle)' }}>
                <div style={{ padding: 'var(--space-md)' }}>
                  <p className="type-body-xs font-semibold text-[var(--color-text-body)] uppercase" style={{ letterSpacing: '0.05em', marginBottom: 'var(--space-sm)' }}>Assignment</p>
                  <dl className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
                    <div className="flex flex-col" style={{ gap: 'var(--space-3xs)' }}>
                      <dt className="type-body-xs text-[var(--color-text-disabled)]">Assigned Reviewer</dt>
                      <dd className="type-body-sm text-[var(--color-text)]">{application.assignedReviewer}</dd>
                    </div>
                    <div className="flex flex-col" style={{ gap: 'var(--space-3xs)' }}>
                      <dt className="type-body-xs text-[var(--color-text-disabled)]">Agency</dt>
                      <dd className="type-body-sm text-[var(--color-text)]">{application.agency}</dd>
                    </div>
                    <div className="flex flex-col" style={{ gap: 'var(--space-3xs)' }}>
                      <dt className="type-body-xs text-[var(--color-text-disabled)]">Region</dt>
                      <dd className="type-body-sm text-[var(--color-text)]">{application.region}</dd>
                    </div>
                  </dl>
                  <div style={{ marginTop: 'var(--space-sm)' }}>
                    <Button variant="primary" size="sm" onClick={() => {}}>
                      Reassign
                    </Button>
                  </div>
                </div>
              </section>

              {/* Payment card */}
              {payment && (
                <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg-subtle)' }}>
                  <div style={{ padding: 'var(--space-md)' }}>
                    <p className="type-body-xs font-semibold text-[var(--color-text-body)] uppercase" style={{ letterSpacing: '0.05em', marginBottom: 'var(--space-sm)' }}>Payment</p>
                    <dl className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
                      <div className="flex flex-col" style={{ gap: 'var(--space-3xs)' }}>
                        <dt className="type-body-xs text-[var(--color-text-disabled)]">Fee Type</dt>
                        <dd className="type-body-sm text-[var(--color-text)]">{payment.feeType}</dd>
                      </div>
                      <div className="flex flex-col" style={{ gap: 'var(--space-3xs)' }}>
                        <dt className="type-body-xs text-[var(--color-text-disabled)]">Amount</dt>
                        <dd className="type-body-sm text-[var(--color-text)]">
                          {payment.amount === 0 ? 'Waived' : `$${payment.amount.toLocaleString()}`}
                        </dd>
                      </div>
                      <div className="flex flex-col" style={{ gap: 'var(--space-3xs)' }}>
                        <dt className="type-body-xs text-[var(--color-text-disabled)]">Status</dt>
                        <dd>
                          <Badge color={getPaymentStatusMeta(payment.status).badgeColor} size="sm">
                            {getPaymentStatusMeta(payment.status).label}
                          </Badge>
                        </dd>
                      </div>
                      {payment.paymentDate && (
                        <div className="flex flex-col" style={{ gap: 'var(--space-3xs)' }}>
                          <dt className="type-body-xs text-[var(--color-text-disabled)]">Payment Date</dt>
                          <dd className="type-body-sm text-[var(--color-text)]">{formatDate(payment.paymentDate)}</dd>
                        </div>
                      )}
                      {payment.paygovTrackingId && (
                        <div className="flex flex-col" style={{ gap: 'var(--space-3xs)' }}>
                          <dt className="type-body-xs text-[var(--color-text-disabled)]">Pay.gov Tracking ID</dt>
                          <dd className="type-body-xs font-mono text-[var(--color-text)]">{payment.paygovTrackingId}</dd>
                        </div>
                      )}
                    </dl>
                    {payment.status === 'pending' && (
                      <div style={{ marginTop: 'var(--space-sm)' }}>
                        <a
                          href="https://pay.gov"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="type-body-xs font-semibold text-[var(--color-text-link)] hover:underline"
                        >
                          View on Pay.gov →
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Key dates */}
              <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg-subtle)' }}>
                <div style={{ padding: 'var(--space-md)' }}>
                  <p className="type-body-xs font-semibold text-[var(--color-text-body)] uppercase" style={{ letterSpacing: '0.05em', marginBottom: 'var(--space-sm)' }}>Key Dates</p>
                  <dl className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
                    <div className="flex flex-col" style={{ gap: 'var(--space-3xs)' }}>
                      <dt className="type-body-xs text-[var(--color-text-disabled)]">Submitted</dt>
                      <dd className="type-body-sm text-[var(--color-text)]">{formatDate(application.submittedDate)}</dd>
                    </div>
                    <div className="flex flex-col" style={{ gap: 'var(--space-3xs)' }}>
                      <dt className="type-body-xs text-[var(--color-text-disabled)]">Last Updated</dt>
                      <dd className="type-body-sm text-[var(--color-text)]">{formatDate(application.updatedDate)}</dd>
                    </div>
                  </dl>
                </div>
              </section>

              {/* PID */}
              <section className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border)]" style={{ background: 'var(--color-bg-subtle)' }}>
                <div style={{ padding: 'var(--space-md)' }}>
                  <p className="type-body-xs font-semibold text-[var(--color-text-body)] uppercase" style={{ letterSpacing: '0.05em', marginBottom: 'var(--space-xs)' }}>PID</p>
                  <p className="type-body-sm font-mono text-[var(--color-text)]">{application.id}</p>
                  <p className="type-body-xs text-[var(--color-text-disabled)]" style={{ marginTop: 'var(--space-3xs)' }}>{application.permitType}</p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
