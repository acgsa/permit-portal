'use client';

import { OnboardingPageScaffold } from '@/components/OnboardingPageScaffold';
import { Card, Checkbox, Input, PillButton, Radio, Select, Textarea } from 'usds';
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
  { value: 'residential-commercial', label: 'Residential/commercial development' },
  { value: 'transportation-infrastructure', label: 'Transportation/infrastructure (roads, bridges, pipelines, rails)' },
  { value: 'energy', label: 'Energy (solar/wind, oil/gas, transmission)' },
  { value: 'mining-extraction', label: 'Mining/resource extraction' },
  { value: 'agriculture-forestry-aquaculture', label: 'Agriculture/forestry/aquaculture' },
  { value: 'wetland-stream-restoration', label: 'Wetland/stream restoration or management' },
  { value: 'telecom-utilities', label: 'Telecommunications/utilities' },
  { value: 'other', label: 'Other (describe)' },
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

  const toggleProjectCategory = (value: string) => {
    setScreener((current) => ({
      ...current,
      projectCategories: current.projectCategories.includes(value)
        ? current.projectCategories.filter((item) => item !== value)
        : [...current.projectCategories, value],
    }));
  };

  const toggleOtherImpact = (value: string) => {
    setScreener((current) => ({
      ...current,
      otherImpacts: current.otherImpacts.includes(value)
        ? current.otherImpacts.filter((item) => item !== value)
        : [...current.otherImpacts, value],
    }));
  };

  return (
    <OnboardingPageScaffold maxWidthClassName="max-w-[760px]">
      <section className="pre-screener-page mx-auto w-full max-w-[680px] pb-[var(--space-2xl)]">
        <div className="pre-screener-intro space-y-[var(--space-md)] text-center text-white">
        <h1 className="type-heading-h3 text-white">Tell us about your project</h1>
        <p className="type-body-md text-[var(--color-text-body)]">
          Share a few details so we can route you to the right place quickly. If you already know the form you need,
          you can <Link href={loginRedirectPath('/applications/new/sf-299')} className="underline underline-offset-4 hover:text-white"> skip this step</Link>.
        </p>
        </div>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 1 of 6</p>
          <h2 className="type-heading-h5 text-white">Which option best describes your project?</h2>
          <p className="type-body-sm text-[var(--color-text-body)]">Choose all that apply.</p>

          <div className="pre-screener-checkbox-list pre-screener-pill-list grid gap-[var(--space-sm)]">
            {PROJECT_CATEGORIES.map((option) => (
              <Checkbox
                key={option.value}
                label={option.label}
                id={`project-category-${option.value}`}
                className="text-[var(--color-text-body)]"
                  checked={screener.projectCategories.includes(option.value)}
                  onChange={() => toggleProjectCategory(option.value)}
              />
            ))}
          </div>

          {screener.projectCategories.includes('other') ? (
            <Input
              label="Other category details"
              inputSize="lg"
              required
              value={screener.otherProjectCategory}
              onChange={(event) => setScreener((current) => ({ ...current, otherProjectCategory: event.target.value }))}
            />
          ) : null}
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 2 of 6</p>
          <h2 className="type-heading-h5 text-white">Describe your project</h2>
          <p className="type-body-sm text-[var(--color-text-body)]">Provide a brief description of purpose and scale.</p>

          <Textarea
            label="Project description and scale"
            required
            rows={5}
            value={screener.projectDescription}
            onChange={(event) => setScreener((current) => ({ ...current, projectDescription: event.target.value }))}
          />

          <h3 className="type-heading-h6 text-white">Location</h3>
          <p className="type-body-sm text-[var(--color-text-body)]">Where is your project located?</p>

          <div className="page-form-split">
            <Input label="Address" inputSize="lg" required value={screener.locationAddress} onChange={(event) => setScreener((current) => ({ ...current, locationAddress: event.target.value }))} />
            <Input label="City" inputSize="lg" required value={screener.locationCity} onChange={(event) => setScreener((current) => ({ ...current, locationCity: event.target.value }))} />
            <Input label="State" inputSize="lg" required maxLength={2} value={screener.locationState} onChange={(event) => setScreener((current) => ({ ...current, locationState: event.target.value.toUpperCase().slice(0, 2) }))} />
            <Input label="ZIP" inputSize="lg" value={screener.locationZip} onChange={(event) => setScreener((current) => ({ ...current, locationZip: event.target.value }))} />
            <Input label="Latitude" inputSize="lg" value={screener.locationLat} onChange={(event) => setScreener((current) => ({ ...current, locationLat: event.target.value }))} />
            <Input label="Longitude" inputSize="lg" value={screener.locationLon} onChange={(event) => setScreener((current) => ({ ...current, locationLon: event.target.value }))} />
          </div>

          <p className="type-body-xs text-[var(--color-text-disabled)]">Interactive map picker preferred; coming soon.</p>

          <div role="group" aria-labelledby="multi-jurisdiction-label" className="page-form-question-block page-form-question-tight">
            <p id="multi-jurisdiction-label" className="type-body-sm text-[var(--color-text-body)]">
              Does it span multiple states, counties, or jurisdictions? (required)
            </p>
            <div className="pre-screener-yes-no flex gap-[var(--space-xl)]">
              <Radio id="multi-jurisdiction-yes" name="multi-jurisdiction" value="yes" checked={screener.multiJurisdictional === 'yes'} onChange={() => setScreener((current) => ({ ...current, multiJurisdictional: 'yes' }))} label="Yes" />
              <Radio id="multi-jurisdiction-no" name="multi-jurisdiction" value="no" checked={screener.multiJurisdictional === 'no'} onChange={() => setScreener((current) => ({ ...current, multiJurisdictional: 'no' }))} label="No" />
            </div>
          </div>
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 3 of 6</p>
          <h2 className="type-heading-h5 text-white">Ownership and jurisdiction</h2>

          <Select
            label="Ownership/Jurisdiction"
            selectSize="lg"
            required
            value={screener.ownershipType}
            onChange={(event) => setScreener((current) => ({ ...current, ownershipType: event.target.value }))}
            options={[
              { value: '', label: 'Select one' },
              { value: 'private', label: 'Private land' },
              { value: 'federal', label: 'Federal land' },
              { value: 'state-local', label: 'State/local government land' },
              { value: 'tribal', label: 'Tribal land or resources' },
              { value: 'other', label: 'Other' },
            ]}
          />

          {screener.ownershipType === 'federal' ? (
            <Input label="Which federal agency?" inputSize="lg" required value={screener.federalAgency} onChange={(event) => setScreener((current) => ({ ...current, federalAgency: event.target.value }))} />
          ) : null}

          {screener.ownershipType === 'other' ? (
            <Input label="Other ownership details" inputSize="lg" required value={screener.otherOwnership} onChange={(event) => setScreener((current) => ({ ...current, otherOwnership: event.target.value }))} />
          ) : null}
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 4 of 6</p>
          <h2 className="type-heading-h5 text-white">Potential Impact</h2>

          <div role="group" aria-labelledby="federal-funding-label" className="page-form-question-block page-form-question-tight">
            <p id="federal-funding-label" className="type-body-sm text-[var(--color-text-body)]">
              Will the project receive or likely receive federal funding, grants, loans, or other financial assistance? (required)
            </p>
            <div className="pre-screener-yes-no flex gap-[var(--space-xl)]">
              <Radio id="federal-funding-yes" name="federal-funding" value="yes" checked={screener.federalFunding === 'yes'} onChange={() => setScreener((current) => ({ ...current, federalFunding: 'yes' }))} label="Yes" />
              <Radio id="federal-funding-no" name="federal-funding" value="no" checked={screener.federalFunding === 'no'} onChange={() => setScreener((current) => ({ ...current, federalFunding: 'no' }))} label="No" />
            </div>
            {screener.federalFunding === 'yes' ? (
              <Input label="Funding source details" inputSize="lg" required value={screener.federalFundingDetails} onChange={(event) => setScreener((current) => ({ ...current, federalFundingDetails: event.target.value }))} />
            ) : null}
          </div>

          <div role="group" aria-labelledby="federal-approval-label" className="page-form-question-block page-form-question-tight">
            <p id="federal-approval-label" className="type-body-sm text-[var(--color-text-body)]">
              Does the project involve any federal approval, license, permit, or use of federal property/right-of-way? (required)
            </p>
            <div className="pre-screener-yes-no flex gap-[var(--space-xl)]">
              <Radio id="federal-approval-yes" name="federal-approval" value="yes" checked={screener.federalApproval === 'yes'} onChange={() => setScreener((current) => ({ ...current, federalApproval: 'yes' }))} label="Yes" />
              <Radio id="federal-approval-no" name="federal-approval" value="no" checked={screener.federalApproval === 'no'} onChange={() => setScreener((current) => ({ ...current, federalApproval: 'no' }))} label="No" />
            </div>
            {screener.federalApproval === 'yes' ? (
              <Input label="Early details" inputSize="lg" value={screener.federalApprovalDetails} onChange={(event) => setScreener((current) => ({ ...current, federalApprovalDetails: event.target.value }))} />
            ) : null}
          </div>
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 5 of 6</p>
          <h2 className="type-heading-h5 text-white">Environmental and permit triggers</h2>
          <p className="type-body-sm text-[var(--color-text-body)]">Use Yes/No and add details where relevant.</p>

          <div className="page-form-question-block page-form-question-tight">
            <p className="type-body-sm text-[var(--color-text-body)]">Will the project involve impacts to wetlands, streams, rivers, lakes, floodplains, or other water bodies? (required)</p>
            <div className="pre-screener-yes-no flex gap-[var(--space-xl)]">
              <Radio id="impacts-water-yes" name="impacts-water" value="yes" checked={screener.impactsWater === 'yes'} onChange={() => setScreener((current) => ({ ...current, impactsWater: 'yes' }))} label="Yes" />
              <Radio id="impacts-water-no" name="impacts-water" value="no" checked={screener.impactsWater === 'no'} onChange={() => setScreener((current) => ({ ...current, impactsWater: 'no' }))} label="No" />
            </div>
            {screener.impactsWater === 'yes' ? (
              <Input label="Tell us more" inputSize="lg" required value={screener.impactsWaterDetails} onChange={(event) => setScreener((current) => ({ ...current, impactsWaterDetails: event.target.value }))} />
            ) : null}
          </div>

          <div className="page-form-question-block page-form-question-tight">
            <p className="type-body-sm text-[var(--color-text-body)]">Will the project potentially affect endangered/threatened species or habitat (including coastal/marine resources)? (required)</p>
            <div className="pre-screener-yes-no flex gap-[var(--space-xl)]">
              <Radio id="impacts-species-yes" name="impacts-species" value="yes" checked={screener.impactsSpecies === 'yes'} onChange={() => setScreener((current) => ({ ...current, impactsSpecies: 'yes' }))} label="Yes" />
              <Radio id="impacts-species-no" name="impacts-species" value="no" checked={screener.impactsSpecies === 'no'} onChange={() => setScreener((current) => ({ ...current, impactsSpecies: 'no' }))} label="No" />
            </div>
            {screener.impactsSpecies === 'yes' ? (
              <Input label="Tell us more" inputSize="lg" required value={screener.impactsSpeciesDetails} onChange={(event) => setScreener((current) => ({ ...current, impactsSpeciesDetails: event.target.value }))} />
            ) : null}
          </div>

          <div className="page-form-question-block page-form-question-tight">
            <p className="type-body-sm text-[var(--color-text-body)]">Will the project involve ground disturbance affecting historic, cultural, or archaeological resources? (required)</p>
            <div className="pre-screener-yes-no flex gap-[var(--space-xl)]">
              <Radio id="impacts-historic-yes" name="impacts-historic" value="yes" checked={screener.impactsHistoric === 'yes'} onChange={() => setScreener((current) => ({ ...current, impactsHistoric: 'yes' }))} label="Yes" />
              <Radio id="impacts-historic-no" name="impacts-historic" value="no" checked={screener.impactsHistoric === 'no'} onChange={() => setScreener((current) => ({ ...current, impactsHistoric: 'no' }))} label="No" />
            </div>
            {screener.impactsHistoric === 'yes' ? (
              <Input label="Tell us more" inputSize="lg" required value={screener.impactsHistoricDetails} onChange={(event) => setScreener((current) => ({ ...current, impactsHistoricDetails: event.target.value }))} />
            ) : null}
          </div>

          <div className="page-form-question-block page-form-question-tight">
            <p className="type-body-sm text-[var(--color-text-body)]">Will the project involve air emissions, discharges, hazardous materials, or waste management? (required)</p>
            <div className="pre-screener-yes-no flex gap-[var(--space-xl)]">
              <Radio id="impacts-pollution-yes" name="impacts-pollution" value="yes" checked={screener.impactsPollution === 'yes'} onChange={() => setScreener((current) => ({ ...current, impactsPollution: 'yes' }))} label="Yes" />
              <Radio id="impacts-pollution-no" name="impacts-pollution" value="no" checked={screener.impactsPollution === 'no'} onChange={() => setScreener((current) => ({ ...current, impactsPollution: 'no' }))} label="No" />
            </div>
            {screener.impactsPollution === 'yes' ? (
              <Input label="Tell us more" inputSize="lg" required value={screener.impactsPollutionDetails} onChange={(event) => setScreener((current) => ({ ...current, impactsPollutionDetails: event.target.value }))} />
            ) : null}
          </div>

          <div className="page-form-question-block page-form-question-tight">
            <p className="type-body-sm text-[var(--color-text-body)]">Any other potential environmental impacts? (optional)</p>
            <div className="pre-screener-checkbox-list grid gap-[var(--space-sm)]">
              {OTHER_IMPACTS.map((impact) => (
                <Checkbox
                  key={impact.value}
                  label={impact.label}
                  id={`impact-${impact.value}`}
                  className="text-[var(--color-text-body)]"
                    checked={screener.otherImpacts.includes(impact.value)}
                    onChange={() => toggleOtherImpact(impact.value)}
                />
              ))}
            </div>
            <Input label="Tell us more" inputSize="lg" value={screener.otherImpactsDetails} onChange={(event) => setScreener((current) => ({ ...current, otherImpactsDetails: event.target.value }))} />
          </div>
        </div>
      </Card>

      <Card size="lg">
        <div className="page-card-body">
          <p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Step 6 of 6</p>
          <h2 className="type-heading-h5 text-white">Contact Info</h2>

          <Textarea
            label="Add any additional information"
            rows={4}
            value={screener.additionalInfo}
            onChange={(event) => setScreener((current) => ({ ...current, additionalInfo: event.target.value }))}
          />

          <div role="group" aria-labelledby="contacted-agencies-label" className="page-form-question-block page-form-question-tight">
            <p id="contacted-agencies-label" className="type-body-sm text-[var(--color-text-body)]">
              Have you already contacted any federal agencies or obtained related permits/studies? (optional)
            </p>
            <div className="pre-screener-yes-no flex gap-[var(--space-xl)]">
              <Radio id="contacted-agencies-yes" name="contacted-agencies" value="yes" checked={screener.contactedAgencies === 'yes'} onChange={() => setScreener((current) => ({ ...current, contactedAgencies: 'yes' }))} label="Yes" />
              <Radio id="contacted-agencies-no" name="contacted-agencies" value="no" checked={screener.contactedAgencies === 'no'} onChange={() => setScreener((current) => ({ ...current, contactedAgencies: 'no' }))} label="No" />
            </div>
            {screener.contactedAgencies === 'yes' ? (
              <Input label="Details" inputSize="lg" value={screener.contactedAgenciesDetails} onChange={(event) => setScreener((current) => ({ ...current, contactedAgenciesDetails: event.target.value }))} />
            ) : null}
          </div>

          <div className="page-form-split">
            <Input label="First name" inputSize="lg" value={screener.applicantFirstName} onChange={(event) => setScreener((current) => ({ ...current, applicantFirstName: event.target.value }))} />
            <Input label="Last name" inputSize="lg" value={screener.applicantLastName} onChange={(event) => setScreener((current) => ({ ...current, applicantLastName: event.target.value }))} />
            <Input label="Organization" inputSize="lg" value={screener.applicantOrganization} onChange={(event) => setScreener((current) => ({ ...current, applicantOrganization: event.target.value }))} />
            <Input label="Email" inputSize="lg" value={screener.applicantEmail} onChange={(event) => setScreener((current) => ({ ...current, applicantEmail: event.target.value }))} />
            <Input label="Phone" inputSize="lg" value={screener.applicantPhone} onChange={(event) => setScreener((current) => ({ ...current, applicantPhone: event.target.value }))} />
          </div>

          <div className="space-y-[var(--space-xs)]">
            <p className="type-body-sm text-[var(--color-text-body)]">Upload supporting files (optional)</p>
            <input type="file" multiple className="type-body-sm text-[var(--color-text-body)]" />
            <p className="type-body-xs text-[var(--color-text-disabled)]">Maps, site plans, photos, preliminary delineations, and surveys can speed routing.</p>
          </div>

          <div className="page-form-question-block page-form-question-tight">
            <p className="type-body-xs text-[var(--color-text-disabled)]">
              This is a screening tool. Final determinations are made by agencies. The form is mobile-friendly, your progress is saved,
              and AI-assisted description parsing is planned as a future enhancement.
            </p>

            <div className="flex flex-wrap gap-[var(--space-md)]">
              <PillButton variant="primary" size="lg" onClick={() => router.push(loginRedirectPath(sf299Route))}>
                Continue
              </PillButton>
              <p className="type-body-sm self-center text-[var(--color-text-body)]">
                Already know your form?{' '}
                <Link href={loginRedirectPath('/applications/new/sf-299')} className="underline underline-offset-4 hover:text-white">
                  Click here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Card>
      </section>
    </OnboardingPageScaffold>
  );
}
