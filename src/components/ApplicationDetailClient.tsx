'use client';

import { useRouter } from 'next/navigation';
import { Check, Circle, Clock3 } from 'lucide-react';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Card } from '@/components/Card';
import { LucideIcon } from '@/components/LucideIcon';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';

type Props = {
  applicationId: string;
};

const STATUS_STEPS = [
  { label: 'Application Submitted', icon: Check },
  { label: 'Initial Screening', icon: Check },
  { label: 'Field Review', icon: Clock3 },
  { label: 'Public Comment', icon: null },
  { label: 'Assessment', icon: null },
  { label: 'Final Decision', icon: null },
];

export default function ApplicationDetailClient({ applicationId }: Props) {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const applicationTitle = 'Eagle Exhibition Toms River Avian Care';
  const lastUpdated = 'July 22, 2025';
  const currentStep = 2;

  if (!token) return null;

  return (
    <WorkspaceShell
      role={user?.role}
      userSub={user?.sub}
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      <PortalPageScaffold
        eyebrow="Applicant Portal"
        title="Application Status"
        subtitle={`#${applicationId} · ${applicationTitle} · Last Updated: ${lastUpdated}`}
      >
        <Card className="bg-[var(--color-bg-elevated)] dark:bg-[var(--color-bg-elevated)]">
          <div className="flex flex-col gap-[var(--space-md)]">
            <div className="flex flex-row items-center justify-between bg-[var(--color-bg-muted)] dark:bg-[var(--color-bg-muted)] rounded-t-md px-4 py-3">
              {STATUS_STEPS.map((step, idx) => (
                <div key={step.label} className="flex-1 flex flex-col items-center">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${idx <= currentStep ? 'border-blue-500 bg-blue-700 text-white' : 'border-gray-700 bg-gray-900 text-gray-400'} font-bold text-lg mb-1`}>
                    {step.icon ? (
                      <LucideIcon icon={step.icon} size={16} />
                    ) : idx <= currentStep ? (
                      <LucideIcon icon={Circle} size={10} fill="currentColor" />
                    ) : (
                      <LucideIcon icon={Circle} size={10} />
                    )}
                  </div>
                  <div className={`text-xs text-center ${idx === currentStep ? 'text-blue-400 font-semibold' : 'text-gray-400'}`}>{step.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-8">
              {STATUS_STEPS.map((_, idx) => (
                <div key={idx} className={`h-1 w-full ${idx < currentStep ? 'bg-blue-500' : 'bg-gray-700'} ${idx === STATUS_STEPS.length - 1 ? '' : 'mr-2'}`} />
              ))}
            </div>
            <div className="px-[var(--space-md)] pb-[var(--space-md)] pt-[var(--space-xs)]">
              <div className="mb-[var(--space-md)]">
                <div className="type-body-strong-sm text-white mb-[var(--space-xs)]">Current status:</div>
                <div className="type-body-sm text-[var(--color-text-body)]">Your application is in review by the field team. Check back for updates.</div>
              </div>
              <div className="type-body-strong-sm mb-[var(--space-xs)] text-white">Notifications:</div>
              <ul className="type-body-sm list-disc pl-6 text-[var(--color-text-body)]">
                <li>No action needed right now. Check your inbox for any requests for additional info.</li>
                <li>Pro Tip: Upload supporting docs early to speed things up!</li>
              </ul>
              <div className="type-body-xs mt-[var(--space-md)] text-[var(--color-text-disabled)]">This tracker will update automatically.</div>
            </div>
          </div>
        </Card>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}
