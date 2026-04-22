// My Applications — redirect to My Projects
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyApplicationsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/a/my-projects');
  }, [router]);
  return null;
}

/* ---------- preserved types for imports elsewhere ---------- */

export type ApplicantDisplayRow = {
  id: number;
  title: string;
  permitNumber: string;
  statusKey: 'in_review' | 'in_progress' | 'pending' | 'rejected' | 'approved';
  updatedLabel: string;
};


