'use client';

import { OnboardingPageScaffold } from '@/components/OnboardingPageScaffold';
import { Card, Checkbox, FormChoice, Input, PillButton, Radio, Select, Textarea } from 'usds';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type YesNo = 'yes' | 'no';

type ScreenerState = {
  projectCategories: string[];
  otherProjectCategory: string;
  projectDescription: string;
  additionalInfo: string;
  locationAddress: string;
  locationCity: string;
  locationState: string;
  locationZip: string;
  locationLat: string;
  locationLon: string;
  multiJurisdictional: YesNo;
  ownershipType: string;
  federalAgency: string;
  otherOwnership: string;
  federalFunding: YesNo;
  federalFundingDetails: string;
  federalApproval: YesNo;
  federalApprovalDetails: string;
  impactsWater: YesNo;
  impactsWaterDetails: string;
  impactsSpecies: YesNo;
  impactsSpeciesDetails: string;
  impactsHistoric: YesNo;
  impactsHistoricDetails: string;
  impactsPollution: YesNo;
  impactsPollutionDetails: string;
  impactsOther: YesNo;
  otherImpacts: string[];
  otherImpactsDetails: string;
  contactedAgencies: YesNo;
  contactedAgenciesDetails: string;
  applicantFirstName: string;
  applicantLastName: string;
  applicantOrganization: string;
  applicantOrgType: string;
  applicantEmail: string;
  applicantPhone: string;
};

const SCREENER_STORAGE_KEY = 'permit.screener.v1';

const DEFAULT_SCREENER_STATE: ScreenerState = {
  projectCategories: [],
  otherProjectCategory: '',
  projectDescription: '',
  additionalInfo: '',
  locationAddress: '',
  locationCity: '',
  locationState: '',
  locationZip: '',
  locationLat: '',
  locationLon: '',
  multiJurisdictional: 'no',
  ownershipType: '',
  federalAgency: '',
  otherOwnership: '',
  federalFunding: 'no',
  federalFundingDetails: '',
  federalApproval: 'no',
  federalApprovalDetails: '',
  impactsWater: 'no',
  impactsWaterDetails: '',
  impactsSpecies: 'no',
  impactsSpeciesDetails: '',
  impactsHistoric: 'no',
  impactsHistoricDetails: '',
  impactsPollution: 'no',
  impactsPollutionDetails: '',
  impactsOther: 'no',
  otherImpacts: [],
  otherImpactsDetails: '',
  contactedAgencies: 'no',
  contactedAgenciesDetails: '',
  applicantFirstName: '',
  applicantLastName: '',
  applicantOrganization: '',
  applicantOrgType: '',
  applicantEmail: '',
  applicantPhone: '',
};

const PROJECT_CATEGORIES = [
  { value: 'residential-commercial', label: 'Residential / Commercial' },
  { value: 'transportation-infrastructure', label: 'Transportation / Infrastructure' },
  { value: 'energy', label: 'Energy' },
  { value: 'mining-extraction', label: 'Mining / Extraction' },
  { value: 'agriculture-forestry-aquaculture', label: 'Agriculture / Forestry / Aquaculture' },
  { value: 'wetland-stream-restoration', label: 'Wetlands / Stream Restoration or Management' },
  { value: 'telecom-utilities', label: 'Telecommunications / Utilities' },
  { value: 'other', label: 'Other (Describe)' },
];

const OTHER_IMPACTS = [
  { value: 'coastal-zones', label: 'Coastal zones' },
  { value: 'wild-scenic-rivers', label: 'Wild/scenic rivers' },
  { value: 'essential-fish-habitat', label: 'Essential fish habitat' },
  { value: 'environmental-justice', label: 'Environmental justice concerns' },
];

function loginRedirectPath(targetPath: string): string {
  return `/login?return_to=${encodeURIComponent(targetPath)}`;
}

export default function PreScreenerPage() {
  const router = useRouter();
  const [screener, setScreener] = useState<ScreenerState>(DEFAULT_SCREENER_STATE);

  useEffect(() => {
    const raw = window.localStorage.getItem(SCREENER_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<ScreenerState>;
      setScreener((current) => ({ ...current, ...parsed }));
    } catch {
      window.localStorage.removeItem(SCREENER_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SCREENER_STORAGE_KEY, JSON.stringify(screener));
  }, [screener]);

  const recommendation = useMemo(() => {
    if (screener.ownershipType === 'federal' || screener.federalApproval === 'yes' || screener.federalFunding === 'yes') {
      return { agencyCode: 'BLM', region: 'Western' };
    }

    return { agencyCode: 'USACE', region: 'Regional District' };
  }, [screener.ownershipType, screener.federalApproval, screener.federalFunding]);

  const primaryCategory = screener.projectCategories[0] ?? 'unspecified';
  const sf299Route = `/applications/new/sf-299?agency=${encodeURIComponent(recommendation.agencyCode)}&region=${encodeURIComponent(recommendation.region)}&state=${encodeURIComponent(screener.locationState.toUpperCase().slice(0, 2))}&project_type=${encodeURIComponent(primaryCategory)}`;

  const toggleOtherImpact = (value: string) => {
    setScreener((current) => ({
      ...current,
      otherImpacts: current.otherImpacts.includes(value)
        ? current.otherImpacts.filter((item) => item !== value)
        : [...current.otherImpacts, value],
    }));
  };

  return (
    <OnboardingPageScaffold maxWidthClassName="max-w-[600px]">
      <section className="pre-screener-page mx-auto w-full max-w-[600px] pb-[var(--space-2xl)]">
        <div className="pre-screener-intro space-y-[var(--space-md)] text-center text-white">
        <h1 className="type-heading-h3 text-white">Tell us about your project</h1>
        <p className="type-body-md text-[var(--color-text-body)]">
          Share a few details so we can route you to the right place quickly. If you already know the form you need,
          you can <Link href={loginRedirectPath('/applications/new/sf-299')} className="underline underline-offset-4 hover:text-white"> skip this step</Link>.
        </p>
        </div>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 1 of 7</p>
          <h2 className="type-heading-h5 text-white">Which option best describes your project?</h2>
          <p className="type-body-md text-[var(--color-text-body)]">Choose all that apply.</p>

          <FormChoice
            type="checkbox"
            layout="stacked"
            options={PROJECT_CATEGORIES}
            value={screener.projectCategories}
            onChange={(val) => setScreener((current) => ({ ...current, projectCategories: val as string[] }))}
          />

          {screener.projectCategories.includes('other') ? (
            <Input
              placeholder="Other category details"
              inputSize="lg"
              value={screener.otherProjectCategory}
              onChange={(event) => setScreener((current) => ({ ...current, otherProjectCategory: event.target.value }))}
            />
          ) : null}
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 2 of 7</p>
          <h2 className="type-heading-h5 text-white">Describe your project</h2>
          <p className="type-body-md text-[var(--color-text-body)]">Provide a brief description of your project. Include its purpose and approximate scale or scope.<span className="text-red-400">*</span></p>

          <Textarea
            placeholder="Project description and scale"
            rows={5}
            value={screener.projectDescription}
            onChange={(event) => setScreener((current) => ({ ...current, projectDescription: event.target.value }))}
          />
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 3 of 7</p>
          <h2 className="type-heading-h5 text-white">Location</h2>
          <p className="type-body-md text-[var(--color-text-body)]">Where is your project located?<span className="text-red-400">*</span></p>

          <Input
            placeholder="Project location"
            inputSize="lg"
            value={screener.locationAddress}
            onChange={(event) => setScreener((current) => ({ ...current, locationAddress: event.target.value }))}
          />
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 4 of 7</p>
          <h2 className="type-heading-h5 text-white">Potential Impact</h2>
          <p className="type-body-md text-[var(--color-text-body)]">Tell us more about your project's potential impact on the environment, wildlife, etc.</p>

          <div className="page-form-question-block">
            <p className="type-body-md text-[var(--color-text-body)]">Will the project involve work in, near, or impacting wetlands, streams, rivers, lakes, floodplains, or other water bodies?</p>
            <FormChoice
              type="radio"
              name="impacts-water"
              layout="split"
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              value={screener.impactsWater}
              onChange={(val) => setScreener((current) => ({ ...current, impactsWater: val as YesNo }))}
            />
          </div>

          <div className="page-form-question-block page-form-question-tight">
            <p className="type-body-md text-[var(--color-text-body)]">Will the project potentially affect endangered, threatened, or candidate species, or their habitat?</p>
            <FormChoice
              type="radio"
              name="impacts-species"
              layout="split"
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              value={screener.impactsSpecies}
              onChange={(val) => setScreener((current) => ({ ...current, impactsSpecies: val as YesNo }))}
            />
          </div>

          <div className="page-form-question-block page-form-question-tight">
            <p className="type-body-md text-[var(--color-text-body)]">Will the project involve ground disturbance, excavation, or construction that could affect historic, cultural, or archaeological resources?</p>
            <FormChoice
              type="radio"
              name="impacts-historic"
              layout="split"
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              value={screener.impactsHistoric}
              onChange={(val) => setScreener((current) => ({ ...current, impactsHistoric: val as YesNo }))}
            />
          </div>

          <div className="page-form-question-block page-form-question-tight">
            <p className="type-body-md text-[var(--color-text-body)]">Will the project involve air emissions, industrial discharges to water, hazardous materials, or waste management?</p>
            <FormChoice
              type="radio"
              name="impacts-pollution"
              layout="split"
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              value={screener.impactsPollution}
              onChange={(val) => setScreener((current) => ({ ...current, impactsPollution: val as YesNo }))}
            />
          </div>

          <div className="page-form-question-block page-form-question-tight">
            <p className="type-body-md text-[var(--color-text-body)]">Any other potential environmental impacts?</p>
            <FormChoice
              type="radio"
              name="impacts-other"
              layout="split"
              options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]}
              value={screener.impactsOther}
              onChange={(val) => setScreener((current) => ({ ...current, impactsOther: val as YesNo }))}
            />
            {screener.impactsOther === 'yes' ? (
              <Input placeholder="Tell us more" inputSize="lg" value={screener.otherImpactsDetails} onChange={(event) => setScreener((current) => ({ ...current, otherImpactsDetails: event.target.value }))} />
            ) : null}
          </div>
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 5 of 7</p>
          <h2 className="type-heading-h5 text-white">Additional Info</h2>
          <p className="type-body-md text-[var(--color-text-body)]">Add any other information or links to supporting files to help speed up your permit application.</p>

          <Textarea
            placeholder="Add any additional information"
            rows={4}
            value={screener.additionalInfo}
            onChange={(event) => setScreener((current) => ({ ...current, additionalInfo: event.target.value }))}
          />
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 6 of 7</p>
          <h2 className="type-heading-h5 text-white">Contact Info</h2>
          <p className="type-body-md text-[var(--color-text-body)]">Who is the applicant?<span className="text-red-400">*</span></p>

          <Input placeholder="First name" inputSize="lg" value={screener.applicantFirstName} onChange={(event) => setScreener((current) => ({ ...current, applicantFirstName: event.target.value }))} />
          <Input placeholder="Last name" inputSize="lg" value={screener.applicantLastName} onChange={(event) => setScreener((current) => ({ ...current, applicantLastName: event.target.value }))} />
          <Input placeholder="Organization" inputSize="lg" value={screener.applicantOrganization} onChange={(event) => setScreener((current) => ({ ...current, applicantOrganization: event.target.value }))} />
          <Input placeholder="Email" inputSize="lg" value={screener.applicantEmail} onChange={(event) => setScreener((current) => ({ ...current, applicantEmail: event.target.value }))} />
          <Input placeholder="Phone number" inputSize="lg" value={screener.applicantPhone} onChange={(event) => setScreener((current) => ({ ...current, applicantPhone: event.target.value }))} />
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 7 of 7</p>
          <h2 className="type-heading-h5 text-white">Finalize and Submit</h2>
          <p className="type-body-md text-[var(--color-text-body)]">
            Review all information carefully before submitting to ensure everything is accurate and complete.
          </p>

          <p className="type-body-xs text-[var(--color-text-disabled)] text-center">
            This is a screening tool. Final determinations are made by agencies.
          </p>

          <div className="flex w-full items-center justify-between" style={{ gap: 'var(--space-md)' }}>
            <PillButton variant="primary" size="lg" onClick={() => router.push('/')}>
              Return to Home
            </PillButton>
            <PillButton variant="secondary" size="lg" onClick={() => router.push(loginRedirectPath(sf299Route))}>
              Submit
            </PillButton>
          </div>
        </div>
      </Card>
      </section>
    </OnboardingPageScaffold>
  );
}
