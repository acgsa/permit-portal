import type { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from 'usds';

export const metadata: Metadata = {
  title: 'Agency Partnerships - PERMIT.GOV',
  description:
    'Connect with PERMIT.GOV on interagency coordination, onboarding, and shared permitting workflows.',
};

export default function PartnershipsPage() {
  return (
    <>
      <Navigation />

      <section className="bg-black py-24 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="type-body-xs uppercase tracking-[0.16em] text-white/45" style={{ marginBottom: 'var(--space-sm)' }}>Interagency</p>
          <h1 className="font-[var(--font-primary)] text-[clamp(2rem,4.6vw,4rem)] font-normal leading-[1.08] text-white">
            Agency Partnerships
          </h1>
          <p className="mt-5 max-w-3xl type-body leading-relaxed text-white/65">
            PERMIT.GOV is built for coordinated federal permitting. We work with agency partners to align
            milestone tracking, reduce duplicative intake, and improve shared decision timelines across
            participating review teams.
          </p>

          <div className="mt-10 rounded-sm border border-white/10 bg-[#0b0c0f] p-6 md:p-8">
            <h2 className="type-heading-h6 text-white">Partnership Focus Areas</h2>
            <ul className="mt-4 space-y-3 type-body-sm text-white/68">
              <li>Interagency workflow and milestone coordination</li>
              <li>Common permit intake patterns and data standardization</li>
              <li>Shared review queue visibility and status transparency</li>
              <li>Operational onboarding for federal teams</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/staff">
                <Button variant="secondary" size="md">
                  Federal Employee Login
                </Button>
              </Link>
              <Link href="/use-cases">
                <Button variant="outline" size="md">
                  Explore Use Cases
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
