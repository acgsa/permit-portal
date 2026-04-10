'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Input, PillButton, Select } from 'usds';
import * as api from '@/lib/api';
import { getToken } from '@/lib/auth';

const ENTITY_TYPE_OPTIONS = [
  { value: '', label: 'Select entity type…' },
  { value: 'individual', label: 'Individual' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'partnership', label: 'Partnership / Association' },
  { value: 'state_local_gov', label: 'State / Local Government' },
  { value: 'federal_agency', label: 'Federal Agency' },
  { value: 'tribal', label: 'Tribal Nation' },
  { value: 'other', label: 'Other' },
];

export default function SettingsPage() {
  const { user, logout, refreshProfile } = useAuth();
  const router = useRouter();

  const [entityType, setEntityType] = useState('');
  const [organization, setOrganization] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!user) {
      router.replace('/login?return_to=/settings');
    }
  }, [user, router]);

  // Seed form from profile
  useEffect(() => {
    if (user?.profile) {
      setEntityType(user.profile.entityType ?? '');
      setOrganization(user.profile.organization ?? '');
    }
  }, [user?.profile]);

  if (!user) return null;

  const profile = user.profile;

  const handleSave = async () => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    setSaved(false);
    try {
      await api.updateSettings(token, {
        entity_type: entityType || undefined,
        organization: organization || undefined,
      });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || user.sub;

  return (
    <WorkspaceShell
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      <div className="min-h-full bg-[var(--color-bg)] p-[var(--space-md)]">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-[var(--space-xl)]" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-3xl)' }}>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--color-text)]">Settings</h1>

          {/* First-time completion banner */}
          {profile?.needsProfileCompletion && (
            <div
              className="rounded-lg"
              style={{
                padding: 'var(--space-lg)',
                background: 'var(--blue-900, #1e3a5f)',
                border: '1px solid var(--blue-700, #2563eb)',
              }}
            >
              <p className="type-body-md font-semibold text-white" style={{ marginBottom: 'var(--space-xs)' }}>
                Complete your profile
              </p>
              <p className="type-body-sm" style={{ color: 'var(--color-text-body)' }}>
                Please select your entity type and organization to complete your account setup.
              </p>
            </div>
          )}

          {/* Read-only login.gov fields */}
          <Card>
            <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div>
                <h2 className="type-heading-h4 text-[var(--color-text)]" style={{ marginBottom: 'var(--space-xs)' }}>
                  Identity Information
                </h2>
                <p className="type-body-sm" style={{ color: 'var(--color-text-body)' }}>
                  Managed by login.gov — update these fields at{' '}
                  <a href="https://secure.login.gov/account" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--blue-400, #60a5fa)' }}>
                    login.gov
                  </a>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-[var(--space-md)] sm:grid-cols-2">
                <ReadOnlyField label="Name" value={displayName} />
                <ReadOnlyField label="Email" value={profile?.email ?? '—'} />
                <ReadOnlyField label="Phone" value={profile?.phone ?? '—'} />
                <ReadOnlyField
                  label="Address"
                  value={
                    [profile?.addressStreet, profile?.addressCity, profile?.addressState, profile?.addressZip]
                      .filter(Boolean)
                      .join(', ') || '—'
                  }
                />
              </div>
            </div>
          </Card>

          {/* Editable fields */}
          <Card>
            <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <h2 className="type-heading-h4 text-[var(--color-text)]">
                Account Details
              </h2>

              <Select
                label="Entity Type"
                name="entityType"
                value={entityType}
                onChange={(e) => {
                  setEntityType(e.target.value);
                  setSaved(false);
                }}
                options={ENTITY_TYPE_OPTIONS}
              />

              <Input
                label="Organization"
                name="organization"
                value={organization}
                onChange={(e) => {
                  setOrganization(e.target.value);
                  setSaved(false);
                }}
                placeholder="e.g. Acme Energy Corp"
              />

              <div className="flex items-center gap-[var(--space-md)]">
                <PillButton
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save Settings'}
                </PillButton>

                {saved && (
                  <span className="type-body-sm font-medium" style={{ color: 'var(--green-400, #4ade80)' }}>
                    ✓ Saved
                  </span>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="type-body-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-body)', marginBottom: '4px' }}>
        {label}
      </p>
      <p className="type-body-md text-[var(--color-text)]">{value}</p>
    </div>
  );
}
