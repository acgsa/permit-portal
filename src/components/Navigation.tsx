'use client';


import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from 'usds';
import { useState } from 'react';
import { MenuIcon, XMarkIcon } from './Icons';
import usappLogo from '@/logo/USAPP.svg';

export function Navigation() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navClass = "sticky top-0 z-50 flex justify-center backdrop-blur-xl bg-black/60 px-2 sm:px-6 lg:px-8";
  const navStyle = {
    paddingTop: 'var(--space-sm)',
    paddingBottom: 'var(--space-sm)',
  };
  return (
    <nav className={navClass} style={navStyle}>
      <div className="w-full max-w-7xl" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <Image src={usappLogo} alt="US Application Portal logo" width={40} height={40} className="h-[40px] w-[40px] object-contain" priority />
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
              <Button
                variant="ghost"
                size="md"
                onClick={() => router.push('/staff')}
              >
                Federal Portal
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => router.push('/login')}
              >
                Applicant Login
              </Button>
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
        <div className="md:hidden absolute left-0 right-0 top-full bg-black/95 backdrop-blur-xl z-50 shadow-lg animate-fade-in flex flex-col items-center py-6 gap-6">
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setMobileMenuOpen(false); router.push('/staff'); }}
          >
            Federal Portal
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setMobileMenuOpen(false); router.push('/login'); }}
          >
            Applicant Login
          </Button>
        </div>
      )}
    </nav>
  );
}
