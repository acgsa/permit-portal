'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { ApiEndpointList, API_SECTIONS } from '@/components/ApiEndpointList';

const QUICKSTART_CODE = `import permitgov from "permitgov";
const client = new permitgov.Client();

const response = await client.projects.create({
  name: "Highway 101 Expansion",
  type: "infrastructure",
  description: "Environmental review for highway expansion project.",
});

console.log(response.project_id);`;

/* ── Nav structure ────────────────────────────────────────────── */

type NavGroup = { heading: string; items: { id: string; label: string }[] };

const NAV_GROUPS: NavGroup[] = [
  {
    heading: 'Get Started',
    items: [
      { id: 'overview', label: 'Overview' },
      { id: 'quickstart', label: 'Quickstart' },
    ],
  },
  {
    heading: 'Core Tools',
    items: API_SECTIONS.map((s) => ({ id: s.id, label: s.title })),
  },
];

const ALL_NAV_IDS = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id));

/* ── Left sidebar nav ─────────────────────────────────────────── */

function ApiSideNav({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  return (
    <nav className="flex flex-col" aria-label="API sections" style={{ gap: 'var(--space-lg)' }}>
      {NAV_GROUPS.map((group, gi) => (
        <div key={group.heading}>
          <p
            className="sidebar-nav-heading"
            style={gi === 0 ? { marginTop: 0 } : undefined}
          >
            {group.heading}
          </p>
          <div className="sidebar-nav-menu-wrap">
            <div className="menu" role="menu">
              {group.items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    role="menuitem"
                    onClick={(e) => {
                      e.preventDefault();
                      onSelect(item.id);
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`menu-item${isActive ? ' menu-item-active' : ''}`}
                  >
                    <span className="menu-item-label">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </nav>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function ApiPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const [mounted, setMounted] = useState(false);

  const isStaff = user?.role === 'staff' || user?.role === 'admin';

  useEffect(() => { setMounted(true); }, []);

  /* Intersection-observer based scroll tracking */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    ALL_NAV_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveSection(id);
  }, []);

  if (!mounted) return null;

  const apiContent = (
      <div className="flex w-full" style={{ background: 'var(--color-bg)' }}>
        {/* Sticky left sidebar — uses USDS sidebar-nav styling */}
        <aside
          className="hidden lg:block shrink-0"
          style={{
            width: 220,
            borderRight: '1px solid var(--color-border)',
            background: 'var(--color-bg-muted)',
          }}
        >
          <div
            className="sticky overflow-y-auto"
            style={{
              top: 'var(--space-xl)',
              maxHeight: 'calc(100vh - var(--space-xl))',
              padding: 'var(--space-sm)',
            }}
          >
            <ApiSideNav activeId={activeSection} onSelect={handleSelect} />
          </div>
        </aside>

        {/* Main content */}
        <div
          className="flex-1 min-w-0"
          style={{
            padding: 'var(--space-xl) var(--space-2xl)',
          }}
        >
          {/* ── Overview ──────────────────────────────────────── */}
          <section id="overview" className="scroll-mt-28" style={{ marginBottom: 'var(--space-3xl)' }}>
            <p
              className="type-body-xs uppercase"
              style={{
                letterSpacing: '0.04em',
                color: 'var(--color-text-disabled)',
                marginBottom: 'var(--space-2xs)',
              }}
            >
              Developer
            </p>
            <h1 className="type-heading-h4" style={{ color: 'var(--color-text)', marginBottom: 'var(--space-xs)' }}>
              API
            </h1>
            <p className="type-body-md" style={{ maxWidth: 700, color: 'var(--color-text-body)' }}>
              REST API reference for authentication, project routing, PIC NEPA data, BPMN workflows, and
              inter-agency coordination. Replace{' '}
              <code
                className="type-body-sm"
                style={{
                  background: 'var(--color-bg-muted)',
                  padding: '2px var(--space-2xs)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {'{BASE_URL}'}
              </code>{' '}
              with your deployment URL.
            </p>
          </section>

          {/* ── Quickstart ────────────────────────────────────── */}
          <section id="quickstart" className="scroll-mt-28" style={{ marginBottom: 'var(--space-3xl)' }}>
            <div
              className="flex flex-col lg:flex-row items-start"
              style={{
                maxWidth: 900,
                background: 'var(--steel-950)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-xl)',
                gap: 'var(--space-xl)',
              }}
            >
              <div className="flex flex-col lg:max-w-[40%] shrink-0" style={{ gap: 'var(--space-sm)' }}>
                <h2 className="type-heading-h5" style={{ color: 'var(--white)' }}>
                  Developer quickstart
                </h2>
                <p className="type-body-md" style={{ color: 'var(--steel-300)' }}>
                  Make your first API request in minutes. Learn the basics of the Permit.gov platform.
                </p>
                <div className="flex" style={{ gap: 'var(--space-sm)', marginTop: 'var(--space-2xs)' }}>
                  <a
                    href="#auth"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect('auth');
                      document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="type-body-sm font-semibold"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: 'var(--radius-pill)',
                      background: 'var(--white)',
                      color: 'var(--steel-950)',
                      padding: 'var(--space-2xs) var(--space-lg)',
                    }}
                  >
                    Get started
                  </a>
                  <a
                    href="#auth"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect('auth');
                      document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="type-body-sm font-semibold"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--steel-500)',
                      color: 'var(--white)',
                      padding: 'var(--space-2xs) var(--space-lg)',
                    }}
                  >
                    Create API key
                  </a>
                </div>
              </div>
              <div className="w-full lg:flex-1 min-w-0">
                <div
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    background: 'var(--steel-900)',
                  }}
                >
                  <div
                    className="type-body-xs"
                    style={{
                      padding: 'var(--space-xs) var(--space-sm)',
                      borderBottom: '1px solid var(--steel-700)',
                      color: 'var(--steel-400)',
                    }}
                  >
                    javascript
                  </div>
                  <pre
                    className="type-body-sm"
                    style={{
                      padding: 'var(--space-sm)',
                      overflowX: 'auto',
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    <code>
                      {QUICKSTART_CODE.split('\n').map((line, i) => (
                        <div key={i} className="flex">
                          <span
                            className="select-none shrink-0"
                            style={{
                              width: 'var(--space-xl)',
                              textAlign: 'right',
                              paddingRight: 'var(--space-sm)',
                              color: 'var(--steel-600)',
                            }}
                          >
                            {i + 1}
                          </span>
                          <span style={{ color: 'var(--steel-200)' }}>{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* ── Core Tools (endpoint reference) ───────────────── */}
          <ApiEndpointList />
        </div>
      </div>
  );

  if (token && isStaff) {
    return (
      <WorkspaceShell
        role={user?.role}
        userSub={user?.sub}
        onSignOut={() => {
          logout();
          router.push('/');
        }}
      >
        {apiContent}
      </WorkspaceShell>
    );
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navigation />
      {apiContent}
    </div>
  );
}

