'use client';

import { Navigation } from '@/components/Navigation';
import { PillButton } from 'usds';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { STAFF_DEMO_USERS } from '@/lib/mockFederalPortalData';

const DEMO_PASSWORD = 'PermitPilot2026!';

export default function StaffLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleDemoPersonaLogin = async (demoEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, DEMO_PASSWORD);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />

      <div className="flex justify-center bg-black text-white px-2 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)]" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div className="w-full max-w-md flex flex-col justify-center">
          <div
            className="text-center"
            style={{
              borderRadius: '14px',
              border: 0,
              background: 'var(--steel-900)',
              boxShadow: '0 18px 50px rgba(0, 0, 0, 0.34)',
              padding: 'var(--space-2xl)',
            }}
          >
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
              <h1 className="type-heading-h3 text-white" style={{ marginBottom: 'var(--space-xs)' }}>Federal Portal</h1>
              <p className="type-body-sm" style={{ color: 'var(--color-text-body)' }}>
                Staff Demo Access
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {error && (
                <div className="rounded-sm border border-red-900/50 bg-red-950/20" style={{ padding: 'var(--space-md)', color: '#ff6b6b' }}>
                  <p className="type-body-sm">{error}</p>
                </div>
              )}
              <PillButton
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                disabled={loading}
                onClick={() => handleDemoPersonaLogin(STAFF_DEMO_USERS[0].email)}
              >
                {loading ? 'Signing in...' : 'Admin'}
              </PillButton>
              <PillButton
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                disabled={loading}
                onClick={() => handleDemoPersonaLogin(STAFF_DEMO_USERS[1].email)}
              >
                {loading ? 'Signing in...' : 'Manager'}
              </PillButton>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <p className="type-body-sm" style={{ color: 'var(--color-text-body)' }}>
              Are you an applicant?{' '}
              <Link href="/login" className="font-semibold hover:text-white transition-colors" style={{ color: 'white' }}>
                Go to Applicant Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
