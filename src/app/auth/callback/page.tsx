'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { saveToken } from '@/lib/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackHandler />
    </Suspense>
  );
}

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      setError('Missing authorization code from login.gov.');
      return;
    }

    const url = new URL(`${BASE_URL}/auth/callback`);
    url.searchParams.set('code', code);
    if (state) url.searchParams.set('state', state);

    fetch(url.toString())
      .then(async (res) => {
        if (!res.ok) {
          const detail = await res.text().catch(() => res.statusText);
          throw new Error(detail || `HTTP ${res.status}`);
        }
        return res.json() as Promise<{ access_token: string }>;
      })
      .then((data) => {
        saveToken(data.access_token);
        router.replace('/home');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Authentication failed.');
      });
  }, [searchParams, router]);

  return (
    <>
      <Navigation />
      <div
        className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-black text-white"
        style={{ padding: 'var(--space-xl)' }}
      >
        {error ? (
          <div className="text-center" style={{ maxWidth: 420 }}>
            <h1 className="type-heading-h3 text-white" style={{ marginBottom: 'var(--space-md)' }}>
              Sign-in failed
            </h1>
            <p className="type-body-md" style={{ color: 'var(--color-text-body)', marginBottom: 'var(--space-lg)' }}>
              {error}
            </p>
            <a href="/login" className="type-body-sm font-semibold underline" style={{ color: 'white' }}>
              Return to login
            </a>
          </div>
        ) : (
          <div className="text-center">
            <p className="type-body-lg text-white">Completing sign-in…</p>
          </div>
        )}
      </div>
    </>
  );
}
