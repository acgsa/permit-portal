'use client';


import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PillButton } from 'usds';
import { useEffect, useState } from 'react';
import { MenuIcon, XMarkIcon } from './Icons';
import ceqSeal from '@/logo/US-CouncilOnEnvironmentalQuality-Seal.svg';

export function Navigation() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navClass = `site-nav sticky top-0 z-50 flex h-[70px] justify-center backdrop-blur-xl px-2 sm:px-6 lg:px-8 transition-colors duration-300 ${isScrolled ? 'bg-black/80' : 'bg-black/60'}`;
  return (
    <nav className={navClass}>
      <div className="w-full max-w-7xl" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
        <div className="flex h-full items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <Image src={ceqSeal} alt="Council on Environmental Quality seal" width={46} height={46} className="h-[46px] w-[46px] object-contain" priority />
            <h6 className="type-heading-h6 text-[var(--color-text-body)]">
              Federal Permit Portal
            </h6>
          </Link>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-[var(--space-lg)]">
              <Link
                href="/use-cases"
                className="type-body-sm text-[color:var(--color-text-body)/0.78] transition-colors hover:text-[var(--color-text-body)]"
              >
                Use Cases
              </Link>
              <Link
                href="/about"
                className="type-body-sm text-[color:var(--color-text-body)/0.78] transition-colors hover:text-[var(--color-text-body)]"
              >
                About
              </Link>
              <span aria-hidden="true" className="h-5 w-px bg-[var(--color-border)]" />
            </div>
            <div className="flex items-center gap-4">
              <PillButton
                variant="primary"
                size="md"
                onClick={() => router.push('/staff')}
              >
                Federal Employee Login
              </PillButton>
              <PillButton
                variant="secondary"
                size="md"
                onClick={() => router.push('/login')}
              >
                Applicant Login
              </PillButton>
            </div>
          </div>
          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-[color:var(--color-text-body)/0.5]"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <XMarkIcon size={28} className="text-[var(--color-text-body)]" /> : <MenuIcon size={28} className="text-[var(--color-text-body)]" />}
          </button>
        </div>
      </div>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="site-nav-mobile md:hidden absolute left-0 right-0 top-full bg-black/95 backdrop-blur-xl z-50 shadow-lg animate-fade-in flex flex-col items-center py-6 gap-6">
          <Link
            href="/use-cases"
            className="type-body-lg text-[color:var(--color-text-body)/0.9] hover:text-[var(--color-text-body)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Use Cases
          </Link>
          <Link
            href="/about"
            className="type-body-lg text-[color:var(--color-text-body)/0.9] hover:text-[var(--color-text-body)]"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <PillButton
            variant="primary"
            size="sm"
            onClick={() => { setMobileMenuOpen(false); router.push('/staff'); }}
          >
            Federal Employee Login
          </PillButton>
          <PillButton
            variant="secondary"
            size="sm"
            onClick={() => { setMobileMenuOpen(false); router.push('/login'); }}
          >
            Applicant Login
          </PillButton>
        </div>
      )}
    </nav>
  );
}
