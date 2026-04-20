'use client';

import { Navigation } from '@/components/Navigation';
import { PillButton } from 'usds';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getToken, getTokenClaims } from '@/lib/auth';
import { IS_DEMO_MODE } from '@/lib/appMode';

function getPostLoginPath(returnTo: string | null): string {
  if (returnTo && returnTo.startsWith('/')) {
    return returnTo;
  }

  const token = getToken();
  if (!token) return '/home';
  const claims = getTokenClaims(token);
  const role = typeof claims.role === 'string' ? claims.role : 'applicant';
  return role === 'staff' || role === 'admin' ? '/dashboard' : '/home';
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  // Demo credentials
  const demoEmail = 'applicant-demo@example.com';
  const demoPassword = 'demo1234';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, loginWithLoginGov } = useAuth();
  const showLoginGov = !IS_DEMO_MODE;
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('return_to');

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
      router.push(getPostLoginPath(returnTo));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed.');
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
              <h1 className="type-heading-h3 text-white" style={{ marginBottom: 'var(--space-xs)' }}>Applicant Login</h1>
              <p className="type-body-sm" style={{ color: 'var(--color-text-body)' }}>
                Sign in to manage your permits and applications
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {error && (
                <div className="rounded-sm border border-red-900/50 bg-red-950/20" style={{ padding: 'var(--space-md)', color: '#ff6b6b' }}>
                  <p className="type-body-sm">{error}</p>
                </div>
              )}

              {showLoginGov && (
                <>
                  {/* Primary: login.gov */}
                  <PillButton
                    type="button"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={loginWithLoginGov}
                  >
                    Sign in with login.gov
                  </PillButton>

                  {/* Divider */}
                  <div className="flex items-center gap-[var(--space-md)]">
                    <div className="flex-1" style={{ height: 1, background: 'var(--steel-700)' }} />
                    <span className="type-body-xs" style={{ color: 'var(--color-text-body)' }}>or</span>
                    <div className="flex-1" style={{ height: 1, background: 'var(--steel-700)' }} />
                  </div>
                </>
              )}

              {/* Secondary: demo login */}
              <PillButton
                type="button"
                variant={showLoginGov ? 'outline' : 'primary'}
                size="lg"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Demo Applicant Login'}
              </PillButton>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: 'var(--space-2xl)' }}>
            <p className="type-body-sm" style={{ color: 'var(--color-text-body)' }}>
              Are you a staff member?{' '}
              <Link href="/staff" className="font-semibold hover:text-white transition-colors" style={{ color: 'white' }}>
                Access Federal Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
