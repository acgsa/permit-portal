'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingPageScaffold } from '@/components/OnboardingPageScaffold';
import { SynopsisCard } from '@/components/SynopsisCard';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Card, PillButton } from 'usds';
import { useAuth } from '@/contexts/AuthContext';
import { submitIntakeProject } from '@/lib/api';
import type { SynopsisResult, IntakeSubmissionResponse } from '@/types/synopsis';

const INTAKE_DRAFT_KEY = 'permit.projectIntake.v1';
const INTAKE_SUBMISSION_KEY = 'permit.projectIntake.submitted.v1';
const SYNOPSIS_KEY = 'permit.projectIntake.synopsis.v1';

export default function SynopsisPage() {
  const router = useRouter();
  const { token, user, logout } = useAuth();
  const [synopsis, setSynopsis] = useState<SynopsisResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<IntakeSubmissionResponse | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(SYNOPSIS_KEY);
    if (!raw) {
      router.replace('/project-intake');
      return;
    }
    try {
      setSynopsis(JSON.parse(raw) as SynopsisResult);
    } catch {
      router.replace('/project-intake');
    }
  }, [router]);

  const handleEdit = () => {
    window.localStorage.removeItem(SYNOPSIS_KEY);
    router.push('/project-intake');
  };

  const handleFinalSubmit = async () => {
    if (!synopsis) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      const draftRaw = window.localStorage.getItem(INTAKE_DRAFT_KEY);
      const intake = draftRaw ? JSON.parse(draftRaw) : {};

      if (token) {
        const result = await submitIntakeProject(token, intake as Record<string, unknown>, synopsis);
        setSubmissionResult(result);
      }

      // Record submission
      window.localStorage.setItem(
        INTAKE_SUBMISSION_KEY,
        JSON.stringify({ submittedAt: new Date().toISOString(), title: 'Project Intake', status: 'submitted' }),
      );
      window.localStorage.removeItem(INTAKE_DRAFT_KEY);
      window.localStorage.removeItem(SYNOPSIS_KEY);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePortalHome = () => {
    router.push('/home?intake_submitted=1');
  };

  if (!synopsis) return null;

  const content = submitted ? (
    <section className="pre-screener-page w-full">
      <Card size="lg">
        <div className="page-card-body">
          <h1 className="type-heading-h4 text-[var(--color-text)]">Thank you!</h1>
          <p className="type-body-md text-[var(--color-text-body)]">Your Project Intake request has been received.</p>

          {submissionResult && (
            <div className="space-y-[var(--space-sm)] mt-[var(--space-sm)] p-[var(--space-md)] bg-[var(--color-bg-alt,var(--color-bg))] rounded-[var(--radius-md)] border border-[var(--color-border)]">
              <p className="type-body-md text-[var(--color-text-body)]">
                <span className="font-semibold">Project ID:</span> {submissionResult.project_id}
              </p>
              <p className="type-body-md text-[var(--color-text-body)]">
                <span className="font-semibold">Routed to:</span> {submissionResult.lead_agency.name} ({submissionResult.lead_agency.code})
              </p>
              {submissionResult.cooperating_agencies.length > 0 && (
                <p className="type-body-md text-[var(--color-text-body)]">
                  <span className="font-semibold">Cooperating agencies:</span>{' '}
                  {submissionResult.cooperating_agencies.map((a) => a.name).join(', ')}
                </p>
              )}
              <p className="type-body-sm text-[var(--color-text-body)]">{submissionResult.message}</p>
            </div>
          )}

          <p className="type-body-md text-[var(--color-text-body)]">
            Our team will review the details and contact you soon with the exact federal forms you need (including a pre-filled SF-299 if applicable).
          </p>
          <p className="type-body-md text-[var(--color-text-body)]">You will receive an email confirmation shortly.</p>

          <PillButton variant="secondary" size="lg" onClick={handlePortalHome}>
            Portal Home
          </PillButton>
        </div>
      </Card>
    </section>
  ) : (
    <section className="synopsis-results-page w-full">
      <div className="space-y-[var(--space-md)] text-center text-[var(--color-text)]" style={{ marginBottom: 'var(--space-2xl)' }}>
        <h1 className="type-heading-h3 text-[var(--color-text)]">Your Project Synopsis</h1>
        <p className="type-body-md text-[var(--color-text-body)]">
          Here&apos;s what we&apos;ve determined based on your project details.
        </p>
      </div>

      <SynopsisCard synopsis={synopsis} />

      <div style={{ marginTop: 'var(--space-2xl)' }}>
        <Card size="lg">
          <div className="page-card-body">
            <h2 className="type-heading-h5 text-[var(--color-text)]">Review & Submit</h2>
          <p className="type-body-md text-[var(--color-text-body)]">
            If everything looks correct, submit your project to begin the review process. Your application will be routed to {synopsis.lead_agency.name}.
          </p>
          {synopsis.required_forms.length > 0 && (
            <p className="type-body-md text-[var(--color-text-body)]">
              If {synopsis.required_forms[0].form_id} is required, we will pre-fill it with the details you entered.
            </p>
          )}

          {submitError && <p className="type-body-sm text-[var(--color-error)]">{submitError}</p>}

          <div aria-hidden="true" className="hidden sm:block" style={{ height: 'var(--space-3xl)' }} />
          <div className="flex w-full flex-col items-stretch gap-[var(--space-md)] sm:flex-row sm:items-center sm:justify-between">
            <PillButton variant="primary" size="lg" onClick={handleEdit}>
              Edit My Information
            </PillButton>
            <PillButton variant="secondary" size="lg" onClick={handleFinalSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Project'}
            </PillButton>
          </div>
        </div>
      </Card>
      </div>
    </section>
  );

  if (token) {
    return (
      <WorkspaceShell
        role={user?.role}
        userSub={user?.sub}
        onSignOut={() => {
          logout();
          router.push('/');
        }}
      >
        <div style={{ maxWidth: 700, marginInline: 'auto', paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-2xl)' }}>
          {content}
        </div>
      </WorkspaceShell>
    );
  }

  return <OnboardingPageScaffold maxWidthClassName="max-w-[700px]">{content}</OnboardingPageScaffold>;
}
