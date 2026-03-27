'use client';

import { OnboardingPageScaffold } from '@/components/OnboardingPageScaffold';
import { Card, FormChoice, PillButton } from 'usds';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ProjectPath = '' | 'ready-unsure-form' | 'need-guidance' | 'ready-sf299';

function loginRedirectPath(targetPath: string): string {
	return `/login?return_to=${encodeURIComponent(targetPath)}`;
}

export default function ScreenerStartPage() {
	const router = useRouter();
	const [projectPath, setProjectPath] = useState<ProjectPath>('');

	const continueDisabled = projectPath === '';

	const handleContinue = () => {
		if (projectPath === 'ready-sf299') {
			router.push(loginRedirectPath('/applications/new/sf-299'));
			return;
		}

		if (projectPath === 'ready-unsure-form' || projectPath === 'need-guidance') {
			router.push('/pre-screener');
		}
	};

	return (
		<OnboardingPageScaffold maxWidthClassName="max-w-[600px]">
			<section className="pre-screener-page mx-auto w-full max-w-[600px] pb-[var(--space-2xl)]">
				<div className="pre-screener-intro space-y-[var(--space-md)] text-center text-white">
					  <h1 className="type-heading-h3 text-white">Let's get started</h1>
				</div>

				<Card size="lg">
					<div className="page-card-body">
						<p className="pre-screener-step-kicker type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">Project Screener</p>
						<h2 className="type-heading-h5 text-white">Which of these best describes your project</h2>

						<FormChoice
							type="radio"
							name="project-path"
							layout="stacked"
							options={[
								{ value: 'ready-unsure-form', label: "I'm not sure which forms to use" },
								{ value: 'need-guidance', label: "I'm not ready and want guidance through the process" },
								{ value: 'ready-sf299', label: "I'm ready to submit Form SF-299" },
							]}
							value={projectPath}
							onChange={(value) => setProjectPath(value as ProjectPath)}
						/>

						<div
							aria-hidden="true"
							style={{
								width: '100%',
								borderTop: 'var(--border-sm) solid color-mix(in srgb, var(--color-border) 70%, transparent)',
								marginTop: 'var(--space-xl)',
								paddingTop: 'var(--space-xl)',
							}}
						/>

						<div className="flex w-full items-center justify-between" style={{ gap: 'var(--space-md)' }}>
							<PillButton variant="primary" size="lg" onClick={() => router.push('/')}>
								Return Home
							</PillButton>
							<PillButton variant="secondary" size="lg" onClick={handleContinue} disabled={continueDisabled}>
								Continue
							</PillButton>
						</div>
					</div>
				</Card>
			</section>
		</OnboardingPageScaffold>
	);
}
