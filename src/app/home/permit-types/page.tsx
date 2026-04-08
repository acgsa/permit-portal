// This file was moved from /dashboard/permit-types/page.tsx to /home/permit-types/page.tsx
// All logic and imports remain unchanged.

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { ImageCardDetail } from '@/components/ImageCardDetail';
import { Button } from 'usds';
import { useAuth } from '@/contexts/AuthContext';
import { getPermitTypeDashboardStats, getPermitTypeCEStats, getAggregateStats } from '@/lib/federalData';

const PERMIT_TYPE_ROWS = [
  {
    slug: 'electricity-transmission-lines',
    name: 'Energy and Transmission',
    agencies: 'DOE, FERC, BLM, USFS, USACE',
    examples: 'Transmission lines, substations, utility-scale generation',
    reviews: 'NEPA, ESA Section 7, CWA Sections 401/404, NHPA Section 106',
    image:
      'https://images.unsplash.com/photo-1641236542806-7b20d6617a4b?q=80&w=962&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    slug: 'critical-minerals-mining',
    name: 'Mining and Critical Minerals',
    agencies: 'BLM, USFS, EPA, USACE',
    examples: 'Plan of Operations, mine expansion, processing facilities',
    reviews: 'NEPA, CWA permitting, air quality permits, reclamation bonding',
    image:
      'https://images.unsplash.com/photo-1585427006146-9948883f2a0e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    slug: 'rights-of-way',
    name: 'Transportation and Surface Infrastructure',
    agencies: 'FHWA, FRA, FTA, USACE, EPA',
    examples: 'Road corridors, rail projects, bridge and interchange upgrades',
    reviews: 'NEPA class of action, Section 404/401, conformity and consultation',
    image:
      'https://images.unsplash.com/photo-1543980084-69bffd24b8ce?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    slug: 'water-resources',
    name: 'Water and Coastal Projects',
    agencies: 'USACE, NOAA, EPA, BOEM',
    examples: 'Ports, dredging, coastal resilience, offshore cables and structures',
    reviews: 'Rivers and Harbors Act Section 10, CWA Section 404, CZMA consistency',
    image:
      'https://images.unsplash.com/photo-1695218736994-f37352f3e397?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

function parseList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function PermitTypesPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const agg = getAggregateStats();

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
          <h1 className="type-heading-h4">Permit Types</h1>
          <p className="type-body-md max-w-4xl text-[var(--color-text-body)]">
            Placeholder guidance organized around common federal permitting pathways. Content is based on high-level
            patterns in public federal sources and should be treated as planning support only until agency-specific
            requirements are confirmed for your project.
          </p>

          {/* Aggregate stats bar */}
          <div className="flex flex-wrap gap-[var(--space-lg)]" style={{ marginTop: 'var(--space-md)' }}>
            <div className="flex items-baseline gap-[var(--space-2xs)]">
              <span className="type-heading-h5">{agg.totalProjects.toLocaleString()}</span>
              <span className="type-body-xs text-[var(--color-text-disabled)]">projects on Federal Permitting Dashboard</span>
            </div>
            <div className="flex items-baseline gap-[var(--space-2xs)]">
              <span className="type-heading-h5">{agg.totalCEs.toLocaleString()}+</span>
              <span className="type-body-xs text-[var(--color-text-disabled)]">categorical exclusions cataloged</span>
            </div>
            <div className="flex items-baseline gap-[var(--space-2xs)]">
              <span className="type-heading-h5">{agg.totalAgencyUnits}</span>
              <span className="type-body-xs text-[var(--color-text-disabled)]">agency NEPA units</span>
            </div>
          </div>
        </header>

        <section>
          <div className="grid grid-cols-1 gap-[var(--space-xl)] md:grid-cols-2" style={{ marginTop: 'var(--space-lg)' }}>
            {PERMIT_TYPE_ROWS.map((row) => {
              const dash = getPermitTypeDashboardStats(row.slug);
              const ce = getPermitTypeCEStats(row.slug);
              return (
              <ImageCardDetail
                key={row.name}
                href={`/use-cases#${row.slug}`}
                image={row.image}
                imageAlt={row.name}
                title={row.name}
                agencies={row.agencies}
                examples={row.examples}
                reviews={parseList(row.reviews)}
                dashboardProjects={dash.projectCount > 0 ? dash.projectCount : undefined}
                categoricalExclusions={ce.totalCEs > 0 ? ce.totalCEs : undefined}
              />
              );
            })}
          </div>
        </section>

        <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-lg)' }}>
          <h2 className="type-heading-h6" style={{ marginBottom: 'var(--space-md)' }}>Federal Sources Referenced For Placeholder Content</h2>
          <ul className="mt-[var(--space-md)] grid gap-[var(--space-sm)] md:grid-cols-2">
            <li>
              <a href="https://www.ecfr.gov/current/title-40/chapter-V/part-1500" target="_blank" rel="noreferrer" className="type-body-sm text-blue-600 dark:text-blue-400 hover:underline">
                CEQ NEPA Regulations (40 CFR 1500-1508)
              </a>
            </li>
            <li>
              <a href="https://www.epa.gov/cwa-404" target="_blank" rel="noreferrer" className="type-body-sm text-blue-600 dark:text-blue-400 hover:underline">
                EPA / Clean Water Act Section 404 Overview
              </a>
            </li>
            <li>
              <a href="https://www.usace.army.mil/Missions/Civil-Works/Regulatory-Program-and-Permits/" target="_blank" rel="noreferrer" className="type-body-sm text-blue-600 dark:text-blue-400 hover:underline">
                USACE Regulatory Program
              </a>
            </li>
            <li>
              <a href="https://www.blm.gov/programs/energy-and-minerals/mining-and-minerals" target="_blank" rel="noreferrer" className="type-body-sm text-blue-600 dark:text-blue-400 hover:underline">
                BLM Mining and Minerals Program
              </a>
            </li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-[var(--space-sm)]">
          <Link href="/regulations">
            <Button variant="primary" size="sm">Review Regulations</Button>
          </Link>
          <Link href="/resources">
            <Button variant="secondary" size="sm">Open Resource Library</Button>
          </Link>
        </div>
      </div>
    </WorkspaceShell>
  );
}
