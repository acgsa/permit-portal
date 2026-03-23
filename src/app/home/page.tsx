
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAuth } from '@/contexts/AuthContext';
import { Button, PlusIcon } from 'usds';

export default function HomePage() {
  const firstName = 'John Doe';
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user?.role === 'staff' || user?.role === 'admin') {
      router.replace('/dashboard');
    }
  }, [user?.role, router]);

  if (user?.role === 'staff' || user?.role === 'admin') {
    return null;
  }

  const summary = [
    { label: 'Total Applications', value: 0, color: 'var(--color-text)' },
    { label: 'Pending', value: 0, color: '#f59e0b' },
    { label: 'Approved', value: 0, color: '#10b981' },
    { label: 'Rejected', value: 0, color: '#f43f5e' },
  ];

  return (
    <WorkspaceShell
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      <div className="min-h-full bg-black p-[var(--space-md)]">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-[var(--space-md)]">
          <section className="flex flex-col gap-[var(--space-md)]">
            <p className="text-sm font-medium text-[var(--color-text-placeholder)]">Welcome back</p>

            <div className="flex flex-col gap-[var(--space-sm)] sm:flex-row sm:items-end sm:justify-between">
              <h1 className="text-5xl font-bold tracking-tight text-[var(--color-text)] sm:text-6xl">{firstName}</h1>

              <div className="sm:shrink-0">
                <Button
                  variant="secondary"
                  size="lg"
                  className="px-6 font-semibold"
                  leadingIcon={<PlusIcon size={16} />}
                  onClick={() => router.push('/pre-screener')}
                >
                  <span>Start New Application</span>
                </Button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '32px' }}>
            {summary.map((item) => (
              <div
                key={item.label}
                className="min-h-[168px] rounded-[var(--radius-md)] bg-[var(--steel-950)] shadow-[var(--shadow-sm)]"
                style={{ padding: '12px' }}
              >
                <div className="flex h-full flex-col justify-between">
                  <p className="text-base font-medium text-[var(--color-text-placeholder)]">{item.label}</p>
                  <h2 style={{ color: item.color, margin: 0 }} className="type-heading-h2 leading-none">{item.value}</h2>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </WorkspaceShell>
  );
}
