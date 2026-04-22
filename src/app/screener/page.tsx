'use client';

import { useEffect, useState } from 'react';
import { OnboardingPageScaffold } from '@/components/OnboardingPageScaffold';
import { Card, PillButton } from 'usds';
import { useRouter } from 'next/navigation';

const INTAKE_DRAFT_KEY = 'permit.projectIntake.v1';
const INTAKE_SUBMISSION_KEY = 'permit.projectIntake.submitted.v1';

function loginRedirectPath(targetPath: string): string {
	return `/login?return_to=${encodeURIComponent(targetPath)}`;
}

export default function ScreenerStartPage() {
	const router = useRouter();
	const [hasDraft, setHasDraft] = useState(false);
	const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

	useEffect(() => {
		const submission = window.localStorage.getItem(INTAKE_SUBMISSION_KEY);
		if (submission) { setHasDraft(false); return; }

		const draft = window.localStorage.getItem(INTAKE_DRAFT_KEY);
		if (!draft) { setHasDraft(false); return; }

		try {
			const parsed = JSON.parse(draft) as Record<string, unknown>;
			const hasContent = Object.values(parsed).some((v) =>
				typeof v === 'string' ? v.trim() !== '' : Array.isArray(v) ? v.length > 0 : typeof v === 'object' && v !== null
			);
			setHasDraft(hasContent);
			if (hasContent && parsed.lastSavedAt) {
				setDraftSavedAt(parsed.lastSavedAt as string);
			}
		} catch {
			setHasDraft(false);
		}
	}, []);

	return (
		<OnboardingPageScaffold maxWidthClassName="max-w-[600px]">
			<section className="pre-screener-page screener-start-page mx-auto w-full max-w-[600px] pb-[var(--space-2xl)]">
				<div className="pre-screener-intro space-y-[var(--space-md)] text-center text-white">
					<h1 className="type-heading-h3 text-white">Where are you in your permit process?</h1>
				</div>

				<Card size="lg" className="bg-[var(--steel-950)]">
					<div className="page-card-body">
						{hasDraft && (
							<div
								className="flex flex-col gap-[var(--space-sm)] rounded-[var(--radius-sm)] sm:flex-row sm:items-center sm:justify-between"
								style={{ backgroundColor: 'var(--steel-800)', padding: 'var(--space-md)', borderRadius: 'var(--radius-sm)' }}
							>
								<div>
									<p className="type-body-sm font-medium text-white">Continue where you left off</p>
									{draftSavedAt && <p className="type-body-xs text-[var(--color-text-disabled)]">Last saved {new Date(draftSavedAt).toLocaleString()}</p>}
								</div>
												  <PillButton variant="secondary" size="md" onClick={() => router.push('/a/project-intake')}>
									Resume Draft
								</PillButton>
							</div>
						)}
						<div className="screener-start-card-stack" style={{ display: 'grid', gap: 'var(--space-lg)', paddingTop: 'var(--space-sm)' }}>
							<div
								className="screener-start-card rounded-[20px] bg-[var(--steel-900)] shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-[background-color,box-shadow,transform,opacity] duration-200 hover:-translate-y-[1px] hover:bg-[var(--steel-800)] hover:shadow-[0_28px_56px_rgba(0,0,0,0.45)]"
								style={{ backgroundColor: 'var(--steel-900)', padding: 'var(--space-2xl)' }}
							>
								<div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
									<h2 className="type-heading-h5 text-white">I'm ready</h2>
									<p className="type-body-md text-[var(--color-text-body)]">I know my project needs Form SF-299 and I have my information ready. This will also handle any additional federal permits if required.</p>
									<PillButton
										variant="secondary"
										size="lg"
										onClick={() => router.push(loginRedirectPath('/applications/new/sf-299'))}
									>
										Start SF-299 Application
									</PillButton>
								</div>
							</div>

							<div
								className="screener-start-card rounded-[20px] bg-[var(--steel-900)] shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-[background-color,box-shadow,transform,opacity] duration-200 hover:-translate-y-[1px] hover:bg-[var(--steel-800)] hover:shadow-[0_28px_56px_rgba(0,0,0,0.45)]"
								style={{ backgroundColor: 'var(--steel-900)', padding: 'var(--space-2xl)' }}
							>
								<div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
									<h2 className="type-heading-h5 text-white">I need guidance</h2>
									<p className="type-body-md text-[var(--color-text-body)]">I'm not sure which federal permits or forms my project needs - including whether or not it involves federal land or multiple agencies.</p>
												  <PillButton variant="secondary" size="lg" onClick={() => router.push('/a/project-intake')}>
										Start My Guided Application
									</PillButton>
								</div>
							</div>

							<div style={{ paddingTop: 'var(--space-md)' }}>
								<p className="type-body-xs text-center text-[var(--color-text-disabled)]">
									Already have your forms?{' '}
									<button
										type="button"
										onClick={() => router.push(loginRedirectPath('/applications/new/sf-299'))}
										className="underline underline-offset-4 hover:text-white"
									>
										Skip to direct upload
									</button>
								</p>
							</div>
						</div>
					</div>
				</Card>
			</section>
		</OnboardingPageScaffold>
	);
}
