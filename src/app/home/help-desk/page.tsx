// This file was moved from /dashboard/help-desk/page.tsx to /home/help-desk/page.tsx
// All logic and imports remain unchanged.

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { HelpDeskContent } from '@/components/HelpDeskContent';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthenticatedHelpDeskPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.replace('/login');
  }, [token, router]);

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
      <div className="w-full bg-[var(--color-bg)] p-[var(--space-md)]">
        <HelpDeskContent mode="authenticated" />
      </div>
    </WorkspaceShell>
  );
}
