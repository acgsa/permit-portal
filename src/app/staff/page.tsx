'use client';

import { Navigation } from '@/components/Navigation';
import { Button, Input } from 'usds';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const DEMO_EMAIL = 'staff.demo@agency.gov';
const DEMO_PASSWORD = 'PermitPilot2026!';

export default function StaffLoginPage() {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push('/home');
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

              <div className="rounded-sm border border-white/12" style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', backgroundColor: 'rgba(255, 255, 255, 0.04)' }}>
                <p className="type-body-xs" style={{ color: 'var(--color-text-disabled)' }}>
                  Pilot Demo Credentials:
                </p>
                <p className="type-body-xs" style={{ color: 'var(--color-text-disabled)' }}>Email: {DEMO_EMAIL}</p>
                <p className="type-body-xs" style={{ color: 'var(--color-text-disabled)' }}>Password: {DEMO_PASSWORD}</p>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    setEmail(DEMO_EMAIL);
                    setPassword(DEMO_PASSWORD);
                  }}
                >
                  Use Demo Credentials
                </Button>
              </div>

              <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-sm)' }}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border"
                    style={{ borderColor: 'var(--color-border-default)' }}
                  />
                  <span className="type-body-sm" style={{ color: 'var(--color-text-body)' }}>
                    Remember this device
                  </span>
                </label>
                <a href="#" className="type-body-sm hover:text-white transition-colors" style={{ color: 'var(--color-text-body)' }}>
                  Reset password
                </a>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full !bg-[var(--color-btn-secondary-bg)] !text-[var(--color-btn-secondary-text)] !border-[var(--color-btn-secondary-border)] hover:!bg-[var(--color-btn-secondary-bg-hover)] hover:!text-[var(--color-btn-secondary-text-hover)]"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Continue'}
              </Button>
            </form>

            <div className="rounded-sm" style={{ marginTop: 'var(--space-2xl)', padding: 'var(--space-md)', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <p className="type-body-xs" style={{ color: 'var(--color-text-disabled)', opacity: 0.8 }}>
                Demo Access: Federal Portal provides access to permit reviews, agency dashboards, and reporting tools. Pilot sign-in goes directly to the home page without an additional verification step.
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
