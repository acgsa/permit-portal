'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingPageScaffold } from '@/components/OnboardingPageScaffold';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Card, FormChoice, Input, PillButton, Textarea } from 'usds';
import { useAuth } from '@/contexts/AuthContext';
import { evaluateSynopsis } from '@/lib/api';

type IntakeFormState = {
  projectCategories: string[];
  projectDescription: string;
  projectLocation: string;
  locationNotes: string;
};

const INTAKE_DRAFT_KEY = 'permit.projectIntake.v1';
const SYNOPSIS_KEY = 'permit.projectIntake.synopsis.v1';

const DEFAULT_FORM: IntakeFormState = {
  projectCategories: [],
  projectDescription: '',
  projectLocation: '',
  locationNotes: '',
};

const CATEGORY_OPTIONS = [
  { value: 'energy-utility', label: 'Energy / Utility' },
  { value: 'transportation-road', label: 'Transportation / Road' },
  { value: 'communications-telecommunications', label: 'Communications / Telecommunications' },
  { value: 'water-canal-irrigation', label: 'Water / Canal / Irrigation' },
  { value: 'other', label: 'Other' },
];

export default function ProjectIntakePage() {
  const router = useRouter();
  const { token, user, logout } = useAuth();
  const [form, setForm] = useState<IntakeFormState>(DEFAULT_FORM);
  const [submitError, setSubmitError] = useState('');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [synopsisLoading, setSynopsisLoading] = useState(false);
  const [synopsisError, setSynopsisError] = useState('');

  useEffect(() => {
    const raw = window.localStorage.getItem(INTAKE_DRAFT_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<IntakeFormState>;
      setForm((current) => ({ ...current, ...parsed }));
    } catch {
      window.localStorage.removeItem(INTAKE_DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    const now = new Date().toISOString();
    window.localStorage.setItem(INTAKE_DRAFT_KEY, JSON.stringify({ ...form, lastSavedAt: now }));
    setLastSavedAt(now);
  }, [form]);

  const validateForm = (): string => {
    if (!form.projectCategories.length) return 'Choose at least one project category.';
    if (!form.projectDescription.trim()) return 'Project description is required.';
    if (!form.projectLocation.trim()) return 'Project location is required.';
    return '';
  };

  const handleSubmit = () => {
    const error = validateForm();
    if (error) {
      setSubmitError(error);
      return;
    }
    setSubmitError('');
    handleEvaluateSynopsis();
  };

  const handleEvaluateSynopsis = async () => {
    setSynopsisLoading(true);
    setSynopsisError('');
    try {
      const result = await evaluateSynopsis(form as unknown as Record<string, unknown>);
      // Store synopsis and navigate to the results page
      window.localStorage.setItem(SYNOPSIS_KEY, JSON.stringify(result));
      router.push('/a/project-intake/synopsis');
    } catch (err) {
      setSynopsisError(err instanceof Error ? err.message : 'Failed to evaluate project. Please try again.');
    } finally {
      setSynopsisLoading(false);
    }
  };

  const intakeContent = (
    <section className="pre-screener-page w-full">
      <div className="pre-screener-intro space-y-[var(--space-md)] text-center text-[var(--color-text)]">
        <h1 className="type-heading-h3 text-[var(--color-text)]">Let&apos;s get started</h1>
      </div>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 1 of 3</p>
          <h2 className="type-heading-h5 text-[var(--color-text)]">Which best describes your project?</h2>
          <p className="type-body-md text-[var(--color-text-body)]">Choose all that apply.*</p>

          <FormChoice
            type="checkbox"
            layout="stacked"
            options={CATEGORY_OPTIONS}
            value={form.projectCategories}
            onChange={(val) => setForm((current) => ({ ...current, projectCategories: val as string[] }))}
          />

          <div aria-hidden="true" style={{ height: 'var(--space-4xl)' }} />
          <div className="space-y-[var(--space-2xs)]">
            <h3 className="type-heading-h6 text-[var(--color-text)]">Brief but detailed description of your project*</h3>
            <p className="type-body-sm text-[var(--color-text-body)]">
              Include general purpose, type of system/facility, related structures, physical specifications (length, width, height, grading, etc.), term of years needed, expected construction timeline, time of year for construction, and any temporary work areas.
            </p>
          </div>
          <Textarea
            rows={6}
            placeholder="Project description"
            value={form.projectDescription}
            onChange={(event) => setForm((current) => ({ ...current, projectDescription: event.target.value }))}
          />
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 2 of 3</p>
          <h2 className="type-heading-h5 text-[var(--color-text)]">Project Location</h2>
          <p className="type-body-md text-[var(--color-text-body)]">Where is your project located?*</p>

          <Input
            inputSize="lg"
            placeholder="Address, landmark, or general location description"
            value={form.projectLocation}
            onChange={(event) => setForm((current) => ({ ...current, projectLocation: event.target.value }))}
          />

          <Textarea
            rows={3}
            placeholder="Additional location notes, coordinates, or map references (optional)"
            value={form.locationNotes}
            onChange={(event) => setForm((current) => ({ ...current, locationNotes: event.target.value }))}
          />
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 3 of 3</p>
          <h2 className="type-heading-h5 text-[var(--color-text)]">Get Your Project Synopsis</h2>
          <p className="type-body-md text-[var(--color-text-body)]">
            Before submitting, let&apos;s determine which federal reviews, permits, and agencies your project will involve.
          </p>

          {submitError ? <p className="type-body-sm text-[var(--color-error)]">{submitError}</p> : null}

          {!synopsisLoading && (
            <div className="flex w-full flex-col items-stretch gap-[var(--space-md)] sm:flex-row sm:items-center sm:justify-between">
              <PillButton variant="primary" size="lg" onClick={() => {
                const now = new Date().toISOString();
                window.localStorage.setItem(INTAKE_DRAFT_KEY, JSON.stringify({ ...form, lastSavedAt: now }));
                setLastSavedAt(now);
                router.push(token ? '/a/home' : '/');
              }}>
                Save & Exit
              </PillButton>
              <PillButton variant="secondary" size="lg" onClick={handleSubmit}>
                Generate Synopsis
              </PillButton>
            </div>
          )}

          {synopsisLoading && (
            <div className="flex flex-col items-center gap-[var(--space-md)] py-[var(--space-xl)]">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]" />
              <p className="type-body-md text-[var(--color-text-body)]">Analyzing your project...</p>
            </div>
          )}

          {synopsisError && (
            <div className="space-y-[var(--space-sm)]">
              <p className="type-body-sm text-[var(--color-error)]">{synopsisError}</p>
              <PillButton variant="secondary" size="sm" onClick={handleEvaluateSynopsis}>
                Retry
              </PillButton>
            </div>
          )}

          {lastSavedAt && !synopsisLoading && (
            <p className="type-body-xs text-center text-[var(--color-text-disabled)]" style={{ paddingTop: 'var(--space-xs)' }}>
              Draft auto-saved at {new Date(lastSavedAt).toLocaleTimeString()}
            </p>
          )}
        </div>
      </Card>
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
          {intakeContent}
        </div>
      </WorkspaceShell>
    );
  }

  return <OnboardingPageScaffold maxWidthClassName="max-w-[700px]">{intakeContent}</OnboardingPageScaffold>;
}
