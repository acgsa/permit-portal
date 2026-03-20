'use client';

import { Navigation } from '@/components/Navigation';
import { Button, Input } from 'usds';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Demo credentials
  const demoEmail = 'applicant-demo@example.com';
  const demoPassword = 'demo1234';

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      setEmail(demoEmail);
      setPassword(demoPassword);
      await login(demoEmail, demoPassword);
      router.push('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };
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
              <h1 className="type-heading-h3 text-white" style={{ marginBottom: 'var(--space-xs)' }}>Applicant Login</h1>
              <p className="type-body-sm" style={{ color: 'var(--color-text-body)' }}>
                Sign in to your permit application account
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {error && (
                <div className="rounded-sm border border-red-900/50 bg-red-950/20" style={{ padding: 'var(--space-md)', color: '#ff6b6b' }}>
                  <p className="type-body-sm">{error}</p>
                </div>
              )}
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-sm)' }}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border"
                    style={{ borderColor: 'var(--color-border-default)' }}
                  />
                  <span className="type-body-sm" style={{ color: 'var(--color-text-body)' }}>
                    Remember me
                  </span>
                </label>
                <a href="#" className="type-body-sm hover:text-white transition-colors" style={{ color: 'var(--color-text-body)' }}>
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                    className="w-full !bg-[var(--color-btn-secondary-bg)] !text-[var(--color-btn-secondary-text)] hover:!bg-[var(--color-btn-secondary-bg-hover)] hover:!text-[var(--color-btn-secondary-text-hover)]"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Demo Applicant Login'}
              </Button>
            </form>

            <div className="border-t border-white/12" style={{ marginTop: 'var(--space-2xl)', paddingTop: 'var(--space-2xl)' }}>
              <p className="text-center type-body-sm" style={{ marginBottom: 'var(--space-md)', color: 'var(--color-text-body)' }}>
                Don't have an account?
              </p>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
              >
                Create New Account
              </Button>
            </div>

            <div className="rounded-sm" style={{ marginTop: 'var(--space-2xl)', padding: 'var(--space-md)', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <p className="type-body-xs" style={{ color: 'var(--color-text-disabled)', opacity: 0.8 }}>
                Demo Account: Use any credentials to explore the portal.
              </p>
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
