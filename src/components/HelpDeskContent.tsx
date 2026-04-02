import Link from 'next/link';
import { Button } from 'usds';

type HelpDeskContentProps = {
  mode?: 'public' | 'authenticated';
};

type HelpImageCardProps = {
  title: string;
  subtitle: string;
  href: string;
  gradient: 'cyan' | 'orange' | 'purple';
};

function HelpImageCard({ title, subtitle, href, gradient }: HelpImageCardProps) {
  return (
    <Link href={href} className="image-card-link">
      <div className="image-card">
        <div className="image-card-image">
          <div className={`image-card-gradient image-card-gradient-${gradient}`} />
        </div>
        <div className="image-card-content">
          <div className="image-card-text">
            <div className="image-card-text-inner">
              <div className="image-card-title type-heading-h5">{title}</div>
              <div className="image-card-subtitle">{subtitle}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function HelpDeskContent({ mode = 'public' }: HelpDeskContentProps) {
  const isAuthenticated = mode === 'authenticated';

  if (isAuthenticated) {
    return (
      <section className="flex w-full flex-col gap-[var(--space-md)]">
        <header className="flex flex-col gap-[var(--space-xs)]">
          <p className="type-body-xs uppercase tracking-[0.14em] text-[var(--color-text-disabled)]">Resources</p>
          <h1 className="type-heading-h4">Help Center</h1>
          <p className="type-body-md max-w-4xl text-[var(--color-text-body)]">
            Mock support guidance for account access, submissions, document uploads, and workflow coordination.
          </p>
        </header>

        <div className="grid grid-cols-1 items-stretch gap-[var(--space-xl)] md:grid-cols-2">
          <HelpImageCard
            title="Application Support"
            subtitle="Applicants: check milestones, respond to information requests, and resolve upload issues."
            href="/home"
            gradient="cyan"
          />
          <HelpImageCard
            title="Agency Review Support"
            subtitle="Federal Employees: access agency review tools, shared milestones, and coordination workflows."
            href="/staff/modeler"
            gradient="orange"
          />
        </div>

        <div className="flex flex-wrap gap-[var(--space-sm)]">
          <Link href="/messages">
            <Button variant="primary" size="sm">Contact Help</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-muted)] py-24 text-[var(--color-text)]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]" style={{ marginBottom: 'var(--space-sm)' }}>Support</p>
        <h1 className="font-[var(--font-primary)] text-[clamp(2rem,4.6vw,4rem)] font-normal leading-[1.08] text-[var(--color-text)]">
          Help Desk
        </h1>
        <p className="mt-5 max-w-3xl type-body leading-relaxed text-[var(--color-text-body)]">
          Need help with account access, submissions, document uploads, or workflow status? The PERMIT.GOV
          Help Desk provides support for both applicant and federal agency experiences.
        </p>

        <div className="mt-10 grid items-stretch gap-4 md:grid-cols-2">
          <HelpImageCard
            title="Application Support"
            subtitle="Sign in to access active applications, milestone tracking, and submission history."
            href="/login"
            gradient="cyan"
          />
          <HelpImageCard
            title="Agency Review Support"
            subtitle="Access agency review queues, shared milestones, and interagency coordination tools."
            href="/staff"
            gradient="orange"
          />
        </div>
      </div>
    </section>
  );
}
