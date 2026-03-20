// Application Detail Page Template
import ApplicationDetailClient from '@/components/ApplicationDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams(): Array<{ id: string }> {
  const mockPermitIds = [
    'C910043198',
    'C710043238',
    'C710043197',
    'C510043277',
    'C210043823',
    'C110043934',
  ];

  const generatedIds = Array.from({ length: 150 }, (_, index) => {
    const id = index + 1;
    return `C${String(id).padStart(8, '0')}`;
  });

  return [...new Set([...mockPermitIds, ...generatedIds])].map((id) => ({ id }));
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;
  return <ApplicationDetailClient applicationId={id} />;
}
