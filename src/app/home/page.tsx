
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAuth } from '@/contexts/AuthContext';
import { Button, PlusIcon } from 'usds';
import { listApplicationDrafts, type ApplicationDraft } from '@/lib/applicantOnboarding';

export default function HomePage() {
  const firstName = 'John Doe';
  const router = useRouter();
  const { user, logout } = useAuth();
  const [drafts, setDrafts] = useState<ApplicationDraft[]>([]);

  useEffect(() => {
    setDrafts(listApplicationDrafts());
  }, []);

  useEffect(() => {
    if (user?.role === 'staff' || user?.role === 'admin') {
      router.replace('/dashboard');
    }
  }, [user?.role, router]);

  if (user?.role === 'staff' || user?.role === 'admin') {
    return null;
  }

  const summary = useMemo(() => {
    const total = drafts.length;
    const pending = drafts.filter((draft) => draft.status === 'draft').length;
    const submitted = drafts.filter((draft) => draft.status === 'submitted').length;

    return [
      { label: 'Total Applications', value: total, color: 'var(--color-text)' },
      { label: 'Drafts', value: pending, color: '#f59e0b' },
      { label: 'Submitted', value: submitted, color: '#10b981' },
      { label: 'Rejected', value: 0, color: '#f43f5e' },
    ];
  }, [drafts]);

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

          <section className="rounded-[var(--radius-md)] border border-white/10 bg-[var(--steel-950)] p-[var(--space-md)]">
            <div className="mb-[var(--space-sm)] flex items-center justify-between gap-4">
              <h2 className="type-heading-h6 text-[var(--color-text)]">Saved Application Drafts</h2>
              <Button variant="outline" size="sm" onClick={() => router.push('/my-applications')}>
                View All Applications
              </Button>
            </div>

            {drafts.length === 0 ? (
              <p className="type-body-sm text-[var(--color-text-placeholder)]">
                No drafts yet. Start a new application to begin the onboarding flow.
              </p>
            ) : (
              <div className="space-y-3">
                {drafts.slice(0, 3).map((draft) => (
                  <div
                    key={draft.id}
                    className="flex flex-col gap-2 rounded-[var(--radius-sm)] border border-white/10 bg-black/30 p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="type-body-sm text-[var(--color-text)]">{draft.title}</p>
                      <p className="type-body-xs text-[var(--color-text-disabled)]">
                        {draft.formType.toUpperCase()} · {draft.agencyCode} · {draft.region} · Last saved{' '}
                        {new Date(draft.updatedAt).toLocaleString()}
                      </p>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(draft.route.includes('draft=') ? draft.route : `${draft.route}?draft=${encodeURIComponent(draft.id)}`)}
                    >
                      Continue
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </WorkspaceShell>
  );
}
