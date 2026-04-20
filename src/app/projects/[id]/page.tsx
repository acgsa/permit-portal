// Project Detail Page
import ProjectDetailClient from '@/components/ProjectDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams(): Array<{ id: string }> {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProjectDetailClient projectId={id} />;
}
