'use client';

import { Navigation } from '@/components/Navigation';
import { Button, Input } from 'usds';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { IS_DEMO_MODE } from '@/lib/appMode';
import { STAFF_DEMO_USERS } from '@/lib/mockFederalPortalData';

const DEMO_PASSWORD = 'PermitPilot2026!';

export default function StaffLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(DEMO_PASSWORD);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
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
          <div className="rounded-sm border border-white/12 bg-white/[0.02]" style={{ padding: 'var(--space-2xl)' }}>
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
              <h1 className="type-heading-h3 text-white" style={{ marginBottom: 'var(--space-xs)' }}>Federal Portal</h1>
              <p className="type-body-sm" style={{ color: 'var(--color-text-body)' }}>
                Federal staff review and approval home
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {error && (
                <div className="rounded-sm border border-red-900/50 bg-red-950/20" style={{ padding: 'var(--space-md)', color: '#ff6b6b' }}>
                  <p className="type-body-sm">{error}</p>
                </div>
              )}
              <div className="rounded-sm border border-white/12" style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', backgroundColor: 'rgba(255, 255, 255, 0.04)' }}>
                <p className="type-body-xs" style={{ color: 'var(--color-text-disabled)' }}>
                  Staff Demo Access
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                  onClick={() => handleDemoPersonaLogin(STAFF_DEMO_USERS[0].email)}
                >
                  {loading ? 'Signing in...' : 'Doug Burgum (Super Admin)'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                  onClick={() => handleDemoPersonaLogin(STAFF_DEMO_USERS[1].email)}
                >
                  {loading ? 'Signing in...' : 'Harmony Munro (Regional Manager)'}
                </Button>
              </div>

              {!IS_DEMO_MODE && (
                <>
                  <Input
                    label="Federal Email Address"
                    type="email"
                    placeholder="you@agency.gov"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                    hint="Use your official .gov email address"
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    variant="secondary"
                    size="lg"
                    className="w-full !bg-[var(--color-btn-secondary-bg)] !text-[var(--color-btn-secondary-text)] hover:!bg-[var(--color-btn-secondary-bg-hover)] hover:!text-[var(--color-btn-secondary-text-hover)]"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Continue'}
                  </Button>
                </>
              )}
            </form>

            <div className="rounded-sm" style={{ marginTop: 'var(--space-2xl)', padding: 'var(--space-md)', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <p className="type-body-xs" style={{ color: 'var(--color-text-disabled)', opacity: 0.8 }}>
                Demo Access: Federal Portal provides role-based staff dashboards. Super Admin sees all applications, while regional managers see only regional applications.
              </p>
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
