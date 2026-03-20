import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { HelpDeskContent } from '@/components/HelpDeskContent';

export const metadata: Metadata = {
  title: 'Help Desk - PERMIT.GOV',
  description: 'Get support for applicant and federal employee permitting workflows on PERMIT.GOV.',
};

export default function HelpDeskPage() {
  return (
    <>
      <Navigation />
      <HelpDeskContent />
    </>
  );
}
