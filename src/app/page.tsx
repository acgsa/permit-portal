import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PillButton, ArrowDownIcon } from 'usds';
import { CyclingHeadline } from '@/components/CyclingHeadline';
import { HeroBackgroundVideo } from '@/components/HeroBackgroundVideo';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navigation />
      {/* Hero Section */}
      <section className="relative h-[min(90vh,580px)] overflow-hidden bg-black">
        <HeroBackgroundVideo />

        {/* Multi-layer gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/20 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="relative mx-auto h-[min(90vh,580px)] w-full flex items-end justify-center px-2 sm:px-0">
          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center" style={{ paddingBottom: 'var(--space-3xl)' }}>
            <CyclingHeadline
              words={['Build', 'Mine', 'Drill', 'Extract', 'Produce']}
              staticText="the Future of America"
              className="mb-8 whitespace-normal md:whitespace-nowrap font-[var(--font-primary)] !text-[clamp(2.35rem,6.4vw,5.9rem)] !font-normal !leading-[1.05] text-white"
            />
          </div>
        </div>
      </section>

      <section className="flex justify-center bg-black text-white px-2 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div className="w-full max-w-7xl flex flex-col items-center gap-8 text-center" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
            <Link href="/project-intake" className="w-full max-w-xs">
              <PillButton
                size="lg"
                variant="secondary"
                className="w-full !bg-[var(--color-btn-secondary-bg)] !text-[var(--color-btn-secondary-text)] md:!text-[15px] lg:!text-[16px] hover:!bg-[var(--color-btn-secondary-bg-hover)] hover:!text-[var(--color-btn-secondary-text-hover)]"
              >
                Start a Project
              </PillButton>
            </Link>
            </div>
          </div>

          <div className="flex justify-center text-[var(--steel-100)] opacity-100 transition-colors hover:text-white">
            <ArrowDownIcon size={24} aria-hidden="true" />
          </div>

          <h2 className="type-heading-h3 max-w-3xl text-white">
            We've revolutionized the permitting process with one secure, digital platform.
          </h2>
          <div style={{ marginBottom: 'var(--space-xl)' }} />
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="flex justify-center bg-black text-white px-2 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div className="w-full max-w-7xl" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
          <div className="mb-10">
            <p className="type-body-xs uppercase tracking-[0.16em]" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-text-disabled)' }}>Permit Use Cases</p>
            <h2 className="type-heading-h3 text-white" style={{ marginBottom: 'var(--space-xl)' }}>High-Demand Federal Permits</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase, index) => (
              <Link
                key={useCase.title}
                href={`/use-cases#${useCase.slug}`}
                className={`group relative aspect-square overflow-hidden rounded-sm bg-[#0d0f12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] ${
                  index === 2
                    ? 'md:col-span-2 md:aspect-[2/1] lg:col-span-1 lg:aspect-square'
                    : index === 3
                      ? 'lg:row-span-2 lg:aspect-auto lg:h-full'
                      : index === 4
                        ? 'lg:col-span-2 lg:aspect-[1.8/1]'
                        : ''
                }`}
              >
                <img
                  src={useCase.image}
                  alt={useCase.title}
                  className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/20 to-black/6 transition-all duration-500 group-hover:from-black/78 group-hover:via-black/30 group-hover:to-black/14" />
                <div className="absolute inset-x-0 bottom-0 bg-transparent" style={{ padding: 'var(--space-md)' }}>
                  <h3 className="type-heading-h6 text-white" style={{ marginBottom: 'var(--space-2xs)' }}>{useCase.title}</h3>
                  <div
                    className="flex max-h-0 translate-y-2 items-center justify-between gap-3 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:max-h-24 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:max-h-24 group-focus-within:translate-y-0 group-focus-within:opacity-100"
                    style={{ marginTop: 'var(--space-2xs)' }}
                  >
                    <p className="type-body-sm text-white" style={{ marginRight: 'var(--space-sm)' }}>{useCase.subhead}</p>
                    <span
                      aria-hidden="true"
                      className="type-heading-h6 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-focus-within:translate-x-0.5"
                      style={{ marginLeft: 'var(--space-sm)' }}
                    >
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Operations Section */}
      <section className="flex justify-center bg-black text-white px-2 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
        <div className="w-full max-w-7xl" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
          <div className="max-w-6xl">
            <h3 className="font-[var(--font-primary)] text-[clamp(1.8rem,4.4vw,4rem)] font-normal leading-[1.1] text-white" style={{ marginBottom: 'var(--space-xl)' }}>
              The official federal permit portal means one workflow for applicants and federal review teams,
              with shared milestones, status transparency, and a centralized authoritative record.
            </h3>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/staff">
                <PillButton variant="primary" size="lg">
                  For Federal Employees
                </PillButton>
              </Link>
              <Link href="/login">
                <PillButton variant="secondary" size="lg">
                  For Applicants
                </PillButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Extra spacer before footer */}
      <div aria-hidden="true" style={{ height: 'var(--space-3xl)', background: '#000000', width: '100%' }} />
      <Footer />
    </>
  );
}

const useCases = [
  {
    slug: 'critical-minerals-mining',
    title: 'Critical Minerals Mining',
    subhead: 'BLM Plan of Operations + NEPA environmental review',
    image:
      'https://images.unsplash.com/photo-1585427006146-9948883f2a0e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    slug: 'oil-gas-drilling',
    title: 'Oil & Gas Drilling',
    subhead: 'APD + Surface Use Approval + NEPA review',
    image:
      'https://images.unsplash.com/photo-1633155617309-6201a8096e8a?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    slug: 'natural-gas-pipelines',
    title: 'Natural Gas Pipelines & LNG Facilities',
    subhead: 'FERC Certificate + SF Right-of-Way + USACE Permit',
    image:
      'https://images.unsplash.com/photo-1714901423336-1884cd3fb50f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    slug: 'electricity-transmission-lines',
    title: 'Electricity Transmission Lines',
    subhead: 'SF Right-of-Way Grant + NEPA review + USACE Permit',
    image:
      'https://images.unsplash.com/photo-1641236542806-7b20d6617a4b?q=80&w=962&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    slug: 'water-resources',
    title: 'Water Resources',
    subhead: 'USACE Permit + NEPA review',
    image:
      'https://images.unsplash.com/photo-1695218736994-f37352f3e397?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    slug: 'advanced-manufacturing',
    title: 'Advanced Manufacturing',
    subhead: 'NEPA review + EPA Air Quality Permits + USACE Wetlands Permit',
    image:
      'https://images.unsplash.com/photo-1725898443195-eac6f4cf11db?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    slug: 'rights-of-way',
    title: 'Rights-of-Way & Linear Infrastructure',
    subhead: 'SF Right-of-Way Application + NEPA review',
    image:
      'https://images.unsplash.com/photo-1543980084-69bffd24b8ce?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

