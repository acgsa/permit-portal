import type { ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

type OnboardingPageScaffoldProps = {
  children: ReactNode;
  maxWidthClassName?: string;
};

/**
 * Shared scaffold for new onboarding/intake pages.
 * Scoped to these routes so spacing updates do not affect existing portal screens.
 */
export function OnboardingPageScaffold({
  children,
  maxWidthClassName = 'max-w-5xl',
}: OnboardingPageScaffoldProps) {
  return (
    <>
      <Navigation />
      <main className="new-page-main">
        <div className={`page-card-stack mx-auto w-full ${maxWidthClassName}`}>{children}</div>
      </main>
      <Footer />
    </>
  );
}

export default OnboardingPageScaffold;