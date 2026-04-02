'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bird, Building2, Cloud, Landmark, Waves } from 'lucide-react';
import { OnboardingPageScaffold } from '@/components/OnboardingPageScaffold';
import { LucideIcon } from '@/components/LucideIcon';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Button, Card, FormChoice, Input, PillButton, Select, Textarea } from 'usds';
import { useAuth } from '@/contexts/AuthContext';

type YesNo = 'yes' | 'no' | '';

type ImpactField = {
  answer: YesNo;
  details: string;
};

type GuidanceFormState = {
  projectCategories: string[];
  projectDescription: string;
  locationStreetOrLandmark: string;
  locationCountyState: string;
  locationTownshipRangeSection: string;
  locationMapNotes: string;
  impactsWaterBodies: ImpactField;
  impactsSpeciesHabitat: ImpactField;
  impactsHistoricCultural: ImpactField;
  impactsAirEnvironmental: ImpactField;
  impactsWaterways: ImpactField;
  applicantFullName: string;
  applicantOrganization: string;
  applicantMailingAddress: string;
  applicantPhone: string;
  applicantEmail: string;
  applicantType: string;
};

const GUIDANCE_DRAFT_KEY = 'permit.applicationGuidance.v1';
const GUIDANCE_SUBMISSION_KEY = 'permit.guidanceRequest.submitted.v1';

const DEFAULT_FORM: GuidanceFormState = {
  projectCategories: [],
  projectDescription: '',
  locationStreetOrLandmark: '',
  locationCountyState: '',
  locationTownshipRangeSection: '',
  locationMapNotes: '',
  impactsWaterBodies: { answer: '', details: '' },
  impactsSpeciesHabitat: { answer: '', details: '' },
  impactsHistoricCultural: { answer: '', details: '' },
  impactsAirEnvironmental: { answer: '', details: '' },
  impactsWaterways: { answer: '', details: '' },
  applicantFullName: '',
  applicantOrganization: '',
  applicantMailingAddress: '',
  applicantPhone: '',
  applicantEmail: '',
  applicantType: '',
};

const CATEGORY_OPTIONS = [
  { value: 'energy-utility', label: 'Energy / Utility' },
  { value: 'transportation-road', label: 'Transportation / Road' },
  { value: 'communications-telecommunications', label: 'Communications / Telecommunications' },
  { value: 'water-canal-irrigation', label: 'Water / Canal / Irrigation' },
  { value: 'other', label: 'Other' },
];

const APPLICANT_TYPE_OPTIONS = [
  { value: 'individual', label: 'Individual' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'partnership-association', label: 'Partnership / Association' },
  { value: 'state-local-government', label: 'State or Local Government' },
  { value: 'federal-agency', label: 'Federal Agency' },
  { value: 'other', label: 'Other' },
];

const IMPACT_QUESTIONS = [
  { key: 'impactsWaterBodies', label: 'Wetlands, streams, or other water bodies', icon: Waves },
  { key: 'impactsSpeciesHabitat', label: 'Endangered or threatened species habitat', icon: Bird },
  { key: 'impactsHistoricCultural', label: 'Historic or cultural resources', icon: Landmark },
  { key: 'impactsAirEnvironmental', label: 'Air emissions or other environmental concerns', icon: Cloud },
  { key: 'impactsWaterways', label: 'Waterways', icon: Building2 },
] as const;

function loginRedirectPath(targetPath: string): string {
  return `/login?return_to=${encodeURIComponent(targetPath)}`;
}

export default function ApplicationGuidancePage() {
  const router = useRouter();
  const { token, user, logout } = useAuth();
  const [form, setForm] = useState<GuidanceFormState>(DEFAULT_FORM);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mapFileNames, setMapFileNames] = useState<string[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(GUIDANCE_DRAFT_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<GuidanceFormState>;
      setForm((current) => ({ ...current, ...parsed }));
    } catch {
      window.localStorage.removeItem(GUIDANCE_DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    if (submitted) return;
    window.localStorage.setItem(GUIDANCE_DRAFT_KEY, JSON.stringify(form));
  }, [form, submitted]);

  const updateImpact = (key: typeof IMPACT_QUESTIONS[number]['key'], value: Partial<ImpactField>) => {
    setForm((current) => ({
      ...current,
      [key]: {
        ...current[key],
        ...value,
      },
    }));
  };

  const validateForm = (): string => {
    if (!form.projectCategories.length) return 'Choose at least one project category.';
    if (!form.projectDescription.trim()) return 'Project description is required.';
    if (!form.locationStreetOrLandmark.trim()) return 'Street address or nearest landmark is required.';
    if (!form.locationCountyState.trim()) return 'County and State are required.';
    if (!form.applicantFullName.trim()) return 'Applicant full name is required.';
    if (!form.applicantMailingAddress.trim()) return 'Mailing address is required.';
    if (!form.applicantPhone.trim()) return 'Telephone number is required.';
    if (!form.applicantEmail.trim()) return 'Email address is required.';
    if (!form.applicantType.trim()) return 'Applicant type is required.';
    return '';
  };

  const recordGuidanceSubmission = () => {
    const payload = {
      submittedAt: new Date().toISOString(),
      title: 'Application Guidance Request',
      status: 'submitted',
    };
    window.localStorage.setItem(GUIDANCE_SUBMISSION_KEY, JSON.stringify(payload));
  };

  const handleSubmit = () => {
    const error = validateForm();
    if (error) {
      setSubmitError(error);
      return;
    }

    setSubmitError('');
    recordGuidanceSubmission();
    window.localStorage.removeItem(GUIDANCE_DRAFT_KEY);
    setSubmitted(true);
  };

  const handleLogin = () => {
    router.push(loginRedirectPath('/home?guidance_submitted=1'));
  };

  const handlePortalHome = () => {
    router.push('/home?guidance_submitted=1');
  };

  const guidanceContent = submitted ? (
    <section className="pre-screener-page mx-auto w-full max-w-[700px] pb-[var(--space-2xl)]">
      <Card size="lg">
        <div className="page-card-body">
          <h1 className="type-heading-h4 text-white">Thank you!</h1>
          <p className="type-body-md text-[var(--color-text-body)]">Your Project Application Guidance Request has been received.</p>

          {!token ? (
            <PillButton variant="primary" size="lg" onClick={handleLogin}>
              Log In to process the guidance request
            </PillButton>
          ) : null}

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
    <section className="pre-screener-page mx-auto w-full max-w-[700px] pb-[var(--space-2xl)]">
      <div className="pre-screener-intro space-y-[var(--space-md)] text-center text-white">
        <h1 className="type-heading-h3 text-white">Let's get started</h1>
      </div>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 1 of 5</p>
          <h2 className="type-heading-h5 text-white">Which best describes your project?</h2>
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
            <h3 className="type-heading-h6 text-white">Brief but detailed description of your project*</h3>
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
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 2 of 5</p>
          <h2 className="type-heading-h5 text-white">Project Location</h2>
          <p className="type-body-md text-[var(--color-text-body)]">Where is your project located?*</p>

          <Input
            inputSize="lg"
            placeholder="Street address or nearest landmark (if known)"
            value={form.locationStreetOrLandmark}
            onChange={(event) => setForm((current) => ({ ...current, locationStreetOrLandmark: event.target.value }))}
          />
          <Input
            inputSize="lg"
            placeholder="County and State"
            value={form.locationCountyState}
            onChange={(event) => setForm((current) => ({ ...current, locationCountyState: event.target.value }))}
          />
          <Input
            inputSize="lg"
            placeholder="Township, Range, Section (if known)"
            value={form.locationTownshipRangeSection}
            onChange={(event) => setForm((current) => ({ ...current, locationTownshipRangeSection: event.target.value }))}
          />

          <div className="space-y-[var(--space-sm)]">
            <p className="type-body-sm text-[var(--color-text-body)]">Attach or describe any maps or coordinates you have</p>
            <div aria-hidden="true" style={{ height: 'var(--space-lg)' }} />
            <div className="flex flex-wrap items-center gap-[var(--space-sm)]">
              <label htmlFor="guidance-map-upload">
                <Button variant="primary" size="sm" style={{ minWidth: '7.5rem' }}>Upload</Button>
              </label>
              <input
                id="guidance-map-upload"
                type="file"
                multiple
                className="sr-only"
                onChange={(event) => {
                  const files = event.target.files;
                  if (!files) {
                    setMapFileNames([]);
                    return;
                  }
                  setMapFileNames(Array.from(files).map((file) => file.name));
                }}
              />
              {mapFileNames.length ? (
                <p className="type-body-xs text-[var(--color-text-disabled)]">{mapFileNames.join(', ')}</p>
              ) : null}
            </div>
            <div aria-hidden="true" style={{ height: 'var(--space-lg)' }} />
            <Textarea
              rows={3}
              placeholder="Describe map details or coordinates"
              value={form.locationMapNotes}
              onChange={(event) => setForm((current) => ({ ...current, locationMapNotes: event.target.value }))}
            />
          </div>
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 3 of 5</p>
          <h2 className="type-heading-h5 text-white">Potential Impact</h2>
          <p className="type-body-md text-[var(--color-text-body)]">Does your project involve any of the following?</p>

          <div className="space-y-[var(--space-md)]">
            {IMPACT_QUESTIONS.map((question) => {
              const impact = form[question.key];
              return (
                <div key={question.key} className="page-form-question-block page-form-question-tight">
                  <div className="flex flex-col items-center gap-[var(--space-2xs)] text-center">
                    <LucideIcon
                      icon={question.icon}
                      size={20}
                      className="shrink-0 text-[var(--color-text-body)]"
                    />
                    <p className="type-body-md text-[1.0625rem] text-[var(--color-text-body)]">{question.label}</p>
                  </div>
                  <FormChoice
                    type="checkbox"
                    layout="split"
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
                    value={impact.answer ? [impact.answer] : []}
                    onChange={(val) => {
                      const selected = Array.isArray(val) ? (val as string[]) : [];
                      if (!selected.length) {
                        updateImpact(question.key, { answer: '' });
                        return;
                      }
                      const next = selected[selected.length - 1];
                      updateImpact(question.key, { answer: next === 'yes' ? 'yes' : 'no' });
                    }}
                  />
                  {impact.answer === 'yes' ? (
                    <Textarea
                      rows={2}
                      placeholder="Brief details"
                      value={impact.details}
                      onChange={(event) => updateImpact(question.key, { details: event.target.value })}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 4 of 5</p>
          <h2 className="type-heading-h5 text-white">Applicant Information</h2>

          <Input
            inputSize="lg"
            placeholder="Full name of applicant"
            value={form.applicantFullName}
            onChange={(event) => setForm((current) => ({ ...current, applicantFullName: event.target.value }))}
          />
          <Input
            inputSize="lg"
            placeholder="Organization / Company name (if applicable)"
            value={form.applicantOrganization}
            onChange={(event) => setForm((current) => ({ ...current, applicantOrganization: event.target.value }))}
          />
          <Input
            inputSize="lg"
            placeholder="Mailing address"
            value={form.applicantMailingAddress}
            onChange={(event) => setForm((current) => ({ ...current, applicantMailingAddress: event.target.value }))}
          />
          <Input
            inputSize="lg"
            placeholder="Telephone number"
            value={form.applicantPhone}
            onChange={(event) => setForm((current) => ({ ...current, applicantPhone: event.target.value }))}
          />
          <Input
            inputSize="lg"
            placeholder="Email address"
            value={form.applicantEmail}
            onChange={(event) => setForm((current) => ({ ...current, applicantEmail: event.target.value }))}
          />
          <Select
            options={APPLICANT_TYPE_OPTIONS}
            value={form.applicantType}
            onChange={(val) => setForm((current) => ({ ...current, applicantType: val as string }))}
          />
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 5 of 5</p>
          <h2 className="type-heading-h5 text-white">Review & Submit</h2>
          <p className="type-body-md text-[var(--color-text-body)]">Review the information you provided.</p>
          <p className="type-body-md text-[var(--color-text-body)]">
            This is a guidance request only - our team will review it and contact you (usually within a few business days) with the exact forms you need and next steps.
          </p>
          <p className="type-body-md text-[var(--color-text-body)]">
            If SF-299 is required, we will pre-fill it with the details you just entered.
          </p>

          {submitError ? <p className="type-body-sm text-[var(--color-error)]">{submitError}</p> : null}

          <div aria-hidden="true" style={{ height: 'var(--space-3xl)' }} />
          <div className="flex w-full items-center justify-between gap-[var(--space-md)]">
            <PillButton variant="outline" size="lg" onClick={() => router.push(token ? '/home' : '/')}>
              Back to Home
            </PillButton>
            <PillButton variant="secondary" size="lg" onClick={handleSubmit}>
              Submit for Review
            </PillButton>
          </div>
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
        <div className="min-h-full bg-[var(--color-bg)] p-[var(--space-md)]">{guidanceContent}</div>
      </WorkspaceShell>
    );
  }

  return <OnboardingPageScaffold maxWidthClassName="max-w-[700px]">{guidanceContent}</OnboardingPageScaffold>;
}
