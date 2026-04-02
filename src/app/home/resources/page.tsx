'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from 'usds';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { useAuth } from '@/contexts/AuthContext';

const TOOL_LINKS = [
  {
    title: 'Bureau of Reclamation Permit Screening Tool',
    category: 'Authorization',
    description: 'Pre-authorization process for permit applications that fall under Bureau of Reclamation.',
    href: '/screener',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3K_Z3whBx_jqYUey2_TfATMr5v7A--_pYjw&s',
    imageAlt: 'Reservoir and dam landscape representing BOR authorization workflows',
    imagePresentation: 'center-on-white',
  },
  {
    title: 'Right-of-Way Permit Screening Tool',
    category: 'Right-of-Way',
    description: 'Pre-authorization process for Right-of-Way permit applications that cover land use and access.',
    href: '/screener',
    image: 'https://images.unsplash.com/photo-1543980084-69bffd24b8ce?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: 'Linear transportation corridor representing right-of-way permitting',
    imagePresentation: 'cover',
  },
  {
    title: 'Application for Permit To Drill (APD) Screening Tool',
    category: 'Drilling',
    description: 'Pre-authorization process for Permit to Drill applications that fall under Bureau of Land Management.',
    href: '/screener',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Flag_of_the_United_States_Bureau_of_Land_Management.svg/1920px-Flag_of_the_United_States_Bureau_of_Land_Management.svg.png',
    imageAlt: 'Flag of the United States Bureau of Land Management',
    imagePresentation: 'cover',
  },
];

export default function ResourcesPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return TOOL_LINKS;

    return TOOL_LINKS.filter((item) =>
      [item.title, item.category, item.description].some((field) =>
        field.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [searchQuery]);

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
      <div className="flex w-full flex-col gap-[var(--space-md)] bg-[var(--color-bg)] p-[var(--space-md)]">
        <header className="flex flex-col gap-[var(--space-xs)]">
          <p className="type-body-xs uppercase tracking-[0.14em] text-[var(--color-text-disabled)]">RESOURCES</p>
          <h1 className="type-heading-h4">Permit Tools</h1>
          <p className="type-body-md max-w-4xl text-[var(--color-text-body)]">
            Access specialized tools and services for permit processing and management
          </p>
        </header>

        <div className="w-full">
          <Input
            type="search"
            inputSize="lg"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search tools and services..."
            aria-label="Search tools and services"
          />
        </div>

        <div
          className="grid grid-cols-1 gap-[var(--space-xl)] md:grid-cols-2"
          style={{ marginTop: 'calc(var(--space-xl) - var(--space-md))' }}
        >
          {filteredTools.map((item) => (
            <div key={item.title} className="image-card rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
                <div
                  className="image-card-image"
                  style={
                    item.imagePresentation === 'center-on-white'
                      ? {
                          background: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 'var(--space-sm)',
                        }
                      : undefined
                  }
                >
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                    style={item.imagePresentation === 'center-on-white' ? { objectFit: 'contain' } : undefined}
                  />
                </div>
                <div className="image-card-content">
                  <div className="image-card-text" style={{ alignItems: 'flex-start' }}>
                    <div className="image-card-text-inner" style={{ gap: 'var(--space-sm)' }}>
                      <div className="image-card-title type-heading-h5">{item.title}</div>
                      <p className="type-body-sm text-[var(--color-text-body)]">{item.description}</p>
                      <Link href={item.href}>
                        <Button variant="primary" size="sm">Launch Tool</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
    </WorkspaceShell>
  );
}
