import Link from 'next/link';
import Image from 'next/image';
import ceqSeal from '@/logo/US-CouncilOnEnvironmentalQuality-Seal.svg';

export function Footer() {
  return (
    <footer className="site-footer flex justify-center border-t border-white/10 bg-[#0a0b0d] text-white px-2 sm:px-6 lg:px-8" style={{ marginTop: '120px', paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
      <div className="w-full max-w-7xl" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
        {/* Brand and links section */}
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-[auto_1fr]" style={{ marginBottom: 'var(--space-3xl)' }}>
          {/* Brand section */}
          <div className="flex flex-col items-start" style={{ gap: 'var(--space-xs)' }}>
            <div className="flex flex-col" style={{ gap: 'var(--space-xs)' }}>
              <p className="type-heading-h5 text-white">PERMIT.GOV</p>
              <p className="type-body-sm" style={{ color: 'var(--color-text-body)' }}>Official Permit Portal of the United States of America</p>
            </div>
            <div style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <Image src={ceqSeal} alt="Council on Environmental Quality seal" width={80} height={80} className="h-[80px] w-[80px] object-contain" priority />
            </div>
          </div>

          {/* Links section */}
          <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="type-body-xs uppercase tracking-[0.14em] font-semibold text-white/70" style={{ marginBottom: 'var(--space-sm)' }}>Portal</p>
            <div className="flex flex-col gap-2">
              <Link href="/login" className="type-body-sm text-white/80 transition-colors hover:text-white">Applicant Login</Link>
              <Link href="/staff" className="type-body-sm text-white/80 transition-colors hover:text-white">Federal Employee Login</Link>
              <Link href="/help-desk" className="type-body-sm text-white/80 transition-colors hover:text-white">Help Desk</Link>
            </div>
          </div>
          <div>
            <p className="type-body-xs uppercase tracking-[0.14em] font-semibold text-white/70" style={{ marginBottom: 'var(--space-sm)' }}>Resources</p>
            <div className="flex flex-col gap-2">
              <a href="https://permitting.innovation.gov/" target="_blank" rel="noreferrer" className="type-body-sm text-white/80 transition-colors hover:text-white">Permitting Innovation Center</a>
              <a href="https://www.whitehouse.gov/omb/" target="_blank" rel="noreferrer" className="type-body-sm text-white/80 transition-colors hover:text-white">Council for Environmental Quality</a>
              <Link href="/partnerships" className="type-body-sm text-white/80 transition-colors hover:text-white">Agency Partnerships</Link>
            </div>
          </div>
          <div>
            <p className="type-body-xs uppercase tracking-[0.14em] font-semibold text-white/70" style={{ marginBottom: 'var(--space-sm)' }}>Policy</p>
            <div className="flex flex-col gap-2">
              <a href="https://www.gsa.gov/reference/freedom-of-information-act-foia" target="_blank" rel="noreferrer" className="type-body-sm text-white/80 transition-colors hover:text-white">FOIA</a>
              <a href="https://www.gsa.gov/website-information/accessibility-aids" target="_blank" rel="noreferrer" className="type-body-sm text-white/80 transition-colors hover:text-white">Accessibility</a>
            </div>
          </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t border-white/10" style={{ paddingTop: 'var(--space-sm)' }}>
          <p className="type-body-xs text-white/55">© 2026 General Services Administration</p>
        </div>
      </div>
    </footer>
  );
}
