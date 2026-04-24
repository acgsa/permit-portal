import StaffProjectDetailClient from './StaffProjectDetailClient';
import { FEDERAL_APPLICATION_MOCK_DATA } from '@/lib/mockFederalPortalData';

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return FEDERAL_APPLICATION_MOCK_DATA.map((r) => ({ id: r.id }));
}

export default async function StaffProjectDetailPage({ params }: Props) {
  const { id } = await params;
  return <StaffProjectDetailClient id={id} />;
}
