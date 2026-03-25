'use client';

import { OnboardingPageScaffold } from '@/components/OnboardingPageScaffold';
import { Card, Input, PillButton, Radio, Select } from 'usds';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type FederalLandAnswer = 'yes' | 'no';

function loginRedirectPath(targetPath: string): string {
  return `/login?return_to=${encodeURIComponent(targetPath)}`;
}

export default function PreScreenerPage() {
  const router = useRouter();
  const [projectType, setProjectType] = useState('linear-infrastructure');
  const [stateCode, setStateCode] = useState('AZ');
  const [federalLand, setFederalLand] = useState<FederalLandAnswer>('yes');

  const recommendation = useMemo(() => {
    if (federalLand === 'yes') {
      return {
        agencyCode: 'BLM',
        region: 'Western',
        formType: 'sf-299',
        reason: 'Projects on or crossing federal land often require a right-of-way filing path.',
      };
    }

    return {
      agencyCode: 'USACE',
      region: 'Regional District',
      formType: 'sf-299',
      reason: 'You may still need a right-of-way filing for associated federal access or utility corridors.',
    };
  }, [federalLand]);

  const sf299Route = `/applications/new/sf-299?agency=${encodeURIComponent(recommendation.agencyCode)}&region=${encodeURIComponent(recommendation.region)}&state=${encodeURIComponent(stateCode)}&project_type=${encodeURIComponent(projectType)}`;
  const projectTypeOptions = [
    { value: 'linear-infrastructure', label: 'Linear Infrastructure' },
    { value: 'energy-generation', label: 'Energy Generation' },
    { value: 'mining-extraction', label: 'Mining / Extraction' },
    { value: 'water-project', label: 'Water Resources Project' },
  ];

  return (
    <OnboardingPageScaffold>
      <Card size="lg">
        <div className="page-card-body">
          <div className="page-card-substack">
            <p className="type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Permit Intake</p>
            <h1 className="type-heading-h3 text-white">Application Screener</h1>
            <p className="type-body-md text-[var(--color-text-body)]">
              Answer a few questions so we can route your project to the right agency, region, and form flow.
            </p>
          </div>

          <div className="page-form-split page-form-split-tight">
            <Select
              label="Project Type"
              options={projectTypeOptions}
              selectSize="lg"
              id="project-type"
              value={projectType}
              onChange={(event) => setProjectType(event.target.value)}
            />

            <Input
              label="Primary State"
              inputSize="lg"
              id="primary-state"
              value={stateCode}
              maxLength={2}
              onChange={(event) => setStateCode(event.target.value.toUpperCase().slice(0, 2))}
              placeholder="AZ"
            />
          </div>

          <div role="group" aria-labelledby="federal-land-label" className="page-form-question-block page-form-question-tight">
            <p id="federal-land-label" className="type-body-xs uppercase tracking-[0.12em] text-[var(--color-text-disabled)]">
              Does your project cross or use federal land?
            </p>
            <div className="flex gap-[var(--space-xl)]">
              <Radio
                id="federal-land-yes"
                name="federal-land"
                value="yes"
                checked={federalLand === 'yes'}
                onChange={() => setFederalLand('yes')}
                label="Yes"
              />
              <Radio
                id="federal-land-no"
                name="federal-land"
                value="no"
                checked={federalLand === 'no'}
                onChange={() => setFederalLand('no')}
                label="No"
              />
            </div>
          </div>

          <div className="page-form-question-block page-form-question-tight">
            <div className="space-y-[var(--space-sm)]">
              <p className="type-body-xs uppercase tracking-[0.12em] text-[var(--color-text-disabled)]">Recommended Routing</p>
              <h2 className="type-heading-h5 text-white">
                {recommendation.agencyCode} · {recommendation.region} Region · {recommendation.formType.toUpperCase()}
              </h2>
              <p className="type-body-md text-[var(--color-text-body)]">{recommendation.reason}</p>
            </div>

            <div className="flex flex-wrap gap-[var(--space-md)]">
              <PillButton
                variant="primary"
                size="lg"
                onClick={() => router.push(loginRedirectPath(sf299Route))}
              >
                Continue to Recommended Form
              </PillButton>
              <PillButton
                variant="outline"
                size="lg"
                onClick={() => router.push(loginRedirectPath('/applications/new/sf-299'))}
              >
                Already Know You Need SF-299
              </PillButton>
            </div>
          </div>
        </div>
      </Card>
    </OnboardingPageScaffold>
  );
}
