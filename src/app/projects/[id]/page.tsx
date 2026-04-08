// Project Detail Page
import ProjectDetailClient from '@/components/ProjectDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams(): Array<{ id: string }> {
  return [
    { id: 'elk-basin-pipeline' },
    { id: 'copper-ridge-road' },
    { id: 'greenfield-highway' },
  ];
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProjectDetailClient projectId={id} />;
}
