import type { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PillButton } from 'usds';

export const metadata: Metadata = {
  title: 'About — PERMIT.GOV',
  description:
    'Learn about the Federal Permit Portal mission, how it improves interagency coordination, and what it delivers for applicants and federal staff.',
};

export default function AboutPage() {
  return (
    <>
      <Navigation />

      <section className="flex justify-center bg-black text-white px-2 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div className="w-full max-w-7xl" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
          <p className="type-body-xs uppercase tracking-[0.16em]" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-text-disabled)' }}>About PERMIT.GOV</p>
          <h1 className="max-w-4xl font-[var(--font-primary)] text-[clamp(2.4rem,5.5vw,4.8rem)] font-normal leading-[1.04] text-white" style={{ marginBottom: 'var(--space-lg)' }}>
            One federal permit portal. Shared timelines. Clear accountability.
          </h1>
          <p className="max-w-3xl type-body leading-relaxed" style={{ marginBottom: '0', color: 'var(--color-text-body)' }}>
            PERMIT.GOV unifies fragmented permitting workflows into a single secure system for applicants,
            agencies, and review teams. The platform improves speed, transparency, and consistency while
            preserving agency authority and statutory requirements.
          </p>
        </div>
      </section>

      <section className="flex justify-center bg-[#060708] text-white px-2 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div className="w-full max-w-7xl grid gap-12 lg:grid-cols-3" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
          <article className="rounded-[var(--radius-md)] border border-white/12 bg-[var(--steel-950)]" style={{ padding: 'var(--space-lg)' }}>
            <p className="type-body-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-text-disabled)', marginBottom: 'var(--space-md)' }}>Mission</p>
            <h2 className="type-heading-h6 text-white" style={{ marginBottom: 'var(--space-md)' }}>Modernize Permitting</h2>
            <p className="type-body-sm leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
              Reduce uncertainty and duplication by giving project teams one source of truth for submission
              status, agency actions, and cross-agency milestones.
            </p>
          </article>

          <article className="rounded-[var(--radius-md)] border border-white/12 bg-[var(--steel-950)]" style={{ padding: 'var(--space-lg)' }}>
            <p className="type-body-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-text-disabled)', marginBottom: 'var(--space-md)' }}>For Applicants</p>
            <h2 className="type-heading-h6 text-white" style={{ marginBottom: 'var(--space-md)' }}>Predictable Project Progress</h2>
            <p className="type-body-sm leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
              Track every required permit and review in one workspace with clear next steps, auditable
              updates, and fewer manual handoffs.
            </p>
          </article>

          <article className="rounded-[var(--radius-md)] border border-white/12 bg-[var(--steel-950)]" style={{ padding: 'var(--space-lg)' }}>
            <p className="type-body-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-text-disabled)', marginBottom: 'var(--space-md)' }}>For Federal Teams</p>
            <h2 className="type-heading-h6 text-white" style={{ marginBottom: 'var(--space-md)' }}>Coordinated Interagency Execution</h2>
            <p className="type-body-sm leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
              Standardized workflows and role-based access support faster decisions, stronger data quality,
              and more effective program oversight.
            </p>
          </article>
        </div>
      </section>

      <section className="flex justify-center bg-black text-white px-2 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div className="w-full max-w-7xl" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
          <p className="type-body-xs uppercase tracking-[0.16em]" style={{ marginBottom: 'var(--space-md)', color: 'var(--color-text-disabled)' }}>Get Started</p>
          <h2 className="font-[var(--font-primary)] text-[clamp(1.8rem,4vw,3.2rem)] font-normal leading-[1.1] text-white" style={{ marginBottom: 'var(--space-2xl)' }}>
            Explore use cases or start a permit application now.
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/use-cases">
              <PillButton variant="outline" size="lg">
                Browse Use Cases
              </PillButton>
            </Link>
            <Link href="/login">
              <PillButton
                variant="secondary"
                size="lg"
                className="!bg-[var(--color-btn-secondary-bg)] !text-[var(--color-btn-secondary-text)] hover:!bg-[var(--color-btn-secondary-bg-hover)] hover:!text-[var(--color-btn-secondary-text-hover)]"
              >
                Applicant Log In
              </PillButton>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
