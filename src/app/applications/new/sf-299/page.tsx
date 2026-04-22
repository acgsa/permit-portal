'use client';

import { OnboardingPageScaffold } from '@/components/OnboardingPageScaffold';
import { Card, Input, PillButton, Textarea } from 'usds';
import { getToken } from '@/lib/auth';
import { createWorkflow, getPreScreenerDraft } from '@/lib/api';
import {
  getApplicationDraftById,
  upsertApplicationDraft,
  type ApplicationDraft,
} from '@/lib/applicantOnboarding';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

type FormState = {
  projectTitle: string;
  applicantOrganization: string;
  contactName: string;
  contactEmail: string;
  projectLocation: string;
  stateCode: string;
  corridorLengthMiles: string;
  projectDescription: string;
};

const EMPTY_STATE: FormState = {
  projectTitle: '',
  applicantOrganization: '',
  contactName: '',
  contactEmail: '',
  projectLocation: '',
  stateCode: '',
  corridorLengthMiles: '',
  projectDescription: '',
};

function toFormState(data: Record<string, string>): FormState {
  return {
    projectTitle: data.projectTitle ?? '',
    applicantOrganization: data.applicantOrganization ?? '',
    contactName: data.contactName ?? '',
    contactEmail: data.contactEmail ?? '',
    projectLocation: data.projectLocation ?? '',
    stateCode: data.stateCode ?? '',
    corridorLengthMiles: data.corridorLengthMiles ?? '',
    projectDescription: data.projectDescription ?? '',
  };
}

function deriveSf299FormFromPreScreener(payload: Record<string, unknown>): Partial<FormState> {
  const asString = (value: unknown): string => (typeof value === 'string' ? value : '');
  const firstName = asString(payload.applicantFirstName).trim();
  const lastName = asString(payload.applicantLastName).trim();
  const city = asString(payload.locationCity).trim();
  const state = asString(payload.locationState).trim().toUpperCase().slice(0, 2);
  const address = asString(payload.locationAddress).trim();
  const description = asString(payload.projectDescription).trim();
  const additional = asString(payload.additionalInfo).trim();

  const contactName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const projectLocation = address || [city, state].filter(Boolean).join(', ');
  const mergedDescription = [description, additional].filter(Boolean).join('\n\n');

  return {
    applicantOrganization: asString(payload.applicantOrganization),
    contactName,
    contactEmail: asString(payload.applicantEmail),
    projectLocation,
    stateCode: state,
    projectDescription: mergedDescription,
  };
}

export default function Sf299FormPage() {
  return (
    <Suspense fallback={null}>
      <Sf299FormPageContent />
    </Suspense>
  );
}

function Sf299FormPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draft');
  const preScreenerDraftIdParam = searchParams.get('pre_screener_draft');
  const preScreenerDraftId = preScreenerDraftIdParam ? Number(preScreenerDraftIdParam) : NaN;
  const agencyParam = searchParams.get('agency') ?? 'BLM';
  const regionParam = searchParams.get('region') ?? 'Western';
  const stateParam = searchParams.get('state') ?? '';

  const [formState, setFormState] = useState<FormState>({ ...EMPTY_STATE, stateCode: stateParam });
  const [localDraftId, setLocalDraftId] = useState<string | undefined>(draftId ?? undefined);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      const query = searchParams.toString();
      const returnTo = query ? `/applications/new/sf-299?${query}` : '/applications/new/sf-299';
      router.replace(`/login?return_to=${encodeURIComponent(returnTo)}`);
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (!draftId) return;
    const draft = getApplicationDraftById(draftId);
    if (!draft) return;

    setLocalDraftId(draft.id);
    setFormState(toFormState(draft.data));
  }, [draftId]);

  useEffect(() => {
    if (!Number.isFinite(preScreenerDraftId) || preScreenerDraftId <= 0) return;

    const token = getToken();
    if (!token) return;

    let cancelled = false;
    const load = async () => {
      try {
        const preScreenerDraft = await getPreScreenerDraft(token, preScreenerDraftId);
        if (cancelled) return;

        setFormState((current) => ({
          ...current,
          ...deriveSf299FormFromPreScreener(preScreenerDraft.payload),
        }));
      } catch {
        // Keep form editable even if prefill lookup fails.
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [preScreenerDraftId]);

  const canSubmit = useMemo(() => {
    return !!(
      formState.projectTitle.trim() &&
      formState.applicantOrganization.trim() &&
      formState.contactName.trim() &&
      formState.contactEmail.trim() &&
      formState.projectLocation.trim()
    );
  }, [formState]);

  const updateField = (key: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const saveDraft = async (status: ApplicationDraft['status']) => {
    setSaving(true);
    setStatusMessage('');

    try {
      const token = getToken();
      let workflowId: number | undefined;

      if (status === 'submitted' && token) {
        const workflow = await createWorkflow(token, {
          process_name: 'permit_process',
          payload: {
            form_type: 'sf-299',
            agency_code: agencyParam,
            region: regionParam,
            ...formState,
          },
        });
        workflowId = workflow.id;
      }

      const draft = upsertApplicationDraft({
        id: localDraftId,
        formType: 'sf-299',
        title: formState.projectTitle.trim() || 'Untitled SF-299 Application',
        agencyCode: agencyParam,
        region: regionParam,
        status,
        route: `/applications/new/sf-299?draft=${encodeURIComponent(localDraftId ?? 'new')}`,
        workflowId,
        data: {
          ...formState,
        },
      });

      const persistedDraft = upsertApplicationDraft({
        ...draft,
        route: `/applications/new/sf-299?draft=${encodeURIComponent(draft.id)}`,
      });

      setLocalDraftId(persistedDraft.id);
      setStatusMessage(
        status === 'submitted'
          ? 'Application submitted and routed for workflow intake.'
          : 'Draft saved. You can resume from your applicant homepage.',
      );
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to save right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingPageScaffold>
      <Card size="lg">
        <div className="page-card-substack">
          <p className="type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">SF-299 Intake</p>
          <h1 className="type-heading-h3 text-white">SF-299 Right-of-Way Application</h1>
          <p className="type-body-md text-[var(--color-text-body)]">
            Agency routing target: {agencyParam} · {regionParam}. Complete this intake and save at any time.
          </p>
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <div className="page-form-split">
            <Input label="Project Title" inputSize="lg" value={formState.projectTitle} onChange={(event) => updateField('projectTitle', event.target.value)} />
            <Input label="Applicant Organization" inputSize="lg" value={formState.applicantOrganization} onChange={(event) => updateField('applicantOrganization', event.target.value)} />
            <Input label="Contact Name" inputSize="lg" value={formState.contactName} onChange={(event) => updateField('contactName', event.target.value)} />
            <Input label="Contact Email" inputSize="lg" value={formState.contactEmail} onChange={(event) => updateField('contactEmail', event.target.value)} />
            <Input label="Project Location" inputSize="lg" value={formState.projectLocation} onChange={(event) => updateField('projectLocation', event.target.value)} />
            <Input label="State" inputSize="lg" value={formState.stateCode} maxLength={2} onChange={(event) => updateField('stateCode', event.target.value.toUpperCase().slice(0, 2))} />
          </div>

          <div className="page-card-substack">
            <Input label="Corridor Length (miles)" inputSize="lg" value={formState.corridorLengthMiles} onChange={(event) => updateField('corridorLengthMiles', event.target.value)} />
            <Textarea label="Project Description" value={formState.projectDescription} onChange={(event) => updateField('projectDescription', event.target.value)} />
          </div>
        </div>
      </Card>

      <Card size="lg">
        <div className="flex flex-wrap gap-[var(--space-md)]">
          <PillButton variant="outline" size="lg" disabled={saving} onClick={() => void saveDraft('draft')}>
            {saving ? 'Saving...' : 'Save Draft'}
          </PillButton>
          <PillButton variant="primary" size="lg" disabled={saving || !canSubmit} onClick={() => void saveDraft('submitted')}>
            Submit Application
          </PillButton>
          <PillButton variant="outline" size="lg" onClick={() => router.push('/a/home')}>
            Back to Applicant Home
          </PillButton>
        </div>

        {statusMessage && (
          <p className="type-body-sm mt-[var(--space-md)] text-[var(--color-text-body)]">{statusMessage}</p>
        )}
      </Card>
    </OnboardingPageScaffold>
  );
}
