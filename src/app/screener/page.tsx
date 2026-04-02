'use client';

import { OnboardingPageScaffold } from '@/components/OnboardingPageScaffold';
import { Card, PillButton } from 'usds';
import { useRouter } from 'next/navigation';

function loginRedirectPath(targetPath: string): string {
	return `/login?return_to=${encodeURIComponent(targetPath)}`;
}

export default function ScreenerStartPage() {
	const router = useRouter();

	return (
		<OnboardingPageScaffold maxWidthClassName="max-w-[600px]">
			<section className="pre-screener-page screener-start-page mx-auto w-full max-w-[600px] pb-[var(--space-2xl)]">
				<div className="pre-screener-intro space-y-[var(--space-md)] text-center text-white">
					<h1 className="type-heading-h3 text-white">Where are you in your permit process?</h1>
				</div>

				<Card size="lg" className="bg-[var(--steel-950)]">
					<div className="page-card-body">
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
									<PillButton variant="secondary" size="lg" onClick={() => router.push('/application-guidance')}>
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
