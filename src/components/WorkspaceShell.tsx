
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarNavigationPanel, Menu, DrawerButton, Button } from 'usds';
import fppLogo from '@/logo/FPP2.svg';

type WorkspaceShellProps = {
  role?: string;
  userSub?: string;
  organizationLabel?: string;
  onSignOut: () => void;
  children: React.ReactNode;
};

type NavItem = {
  label: string;
  href: string;
};

function getPrimaryNavItems(): NavItem[] {
  return [
    { label: 'Home', href: '/home' },
    { label: 'My Applications', href: '/my-applications' },
    { label: 'My Tasks', href: '/my-tasks' },
    { label: 'Messages', href: '/messages' },
  ];
}

function getResourceNavItems(): NavItem[] {
  return [
    { label: 'Permit Types', href: '/permit-types' },
    { label: 'Regulations', href: '/regulations' },
    { label: 'Resources', href: '/resources' },
    { label: 'Help Center', href: '/help-center' },
  ];
}

function getRoleLabel(role?: string): string {
  if (role === 'staff' || role === 'admin') return 'Federal Staff';
  return 'Applicant';
}

function formatDisplayName(userSub?: string): string {
  if (!userSub) return 'Portal User';
  if (!userSub.includes('@')) return userSub;
  const local = userSub.split('@')[0] ?? '';
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (!parts.length) return userSub;
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function resolveSidebarIdentity(role?: string, userSub?: string, organizationLabel?: string): { displayName: string; organizationLabel?: string } {
  if (!userSub) {
    if (role === 'staff' || role === 'admin') {
      return {
        displayName: 'Harmony Munro',
        organizationLabel: 'Bureau of Reclamation',
      };
    }

    return {
      displayName: 'John Doe',
      organizationLabel: 'Company ABC',
    };
  }

  const normalized = (userSub ?? '').toLowerCase();
  const isDemoUser =
    normalized.includes('demo') ||
    normalized.includes('john.doe') ||
    normalized.includes('john_doe') ||
    normalized === 'john doe' ||
    normalized === 'applicant';

  if (isDemoUser) {
    if (role === 'staff' || role === 'admin') {
      return {
        displayName: 'Harmony Munro',
        organizationLabel: 'Bureau of Reclamation',
      };
    }

    return {
      displayName: 'John Doe',
      organizationLabel: 'Company ABC',
    };
  }

  return {
    displayName: formatDisplayName(userSub),
    organizationLabel,
  };
}

function getInitials(displayName: string): string {
  const words = displayName.split(' ').filter(Boolean);
  if (!words.length) return 'PU';
  const first = words[0]?.charAt(0) ?? '';
  const second = words[1]?.charAt(0) ?? '';
  return `${first}${second || first}`.toUpperCase();
}

const FPPLogo = ({ size = 40 }: { size?: number }) => (
  <Image src={fppLogo} alt="Federal Permit Portal logo" width={size} height={size} className="object-contain" priority />
);

interface MenuItem {
  type: 'subtext';
  label: string;
  subtext: string;
  href: string;
  onClick?: () => void;
}

interface CustomSidebarProps {
  role?: string;
  displayName: string;
  initials: string;
  organizationLabel?: string;
  onSignOut: () => void;
  primaryMenuItems: MenuItem[];
  resourceMenuItems: MenuItem[];
}

function CustomSidebarInner({
  role,
  displayName,
  initials,
  organizationLabel,
  onSignOut,
  primaryMenuItems,
  resourceMenuItems,
}: CustomSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const currentPath = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;

  const matchesNavHref = (href: string): boolean => {
    if (href === '/home') return currentPath === '/home';
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  const primaryActiveIndex = primaryMenuItems.findIndex((item) => matchesNavHref(item.href));
  const resourceActiveIndex = resourceMenuItems.findIndex((item) => matchesNavHref(item.href));

  useEffect(() => {
    setMounted(true);
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme as 'light' | 'dark');
  }, []);

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <aside className={`sidebar-nav-panel${isOpen ? "" : " sidebar-nav-panel-closed"}`} aria-label="Sidebar navigation panel" style={{ width: isOpen ? 200 : 66, border: 'none', borderRadius: '0', display: 'flex', flexDirection: 'column', height: '100vh' }} suppressHydrationWarning>
      <div className="sidebar-nav-panel-top">
        {mounted && isOpen && (
          <>
            <button type="button" className="sidebar-nav-logo" aria-label="Agency home">
              <FPPLogo size={40} />
            </button>
            <DrawerButton
              state="open"
              direction="right"
              onClick={() => setIsOpen(false)}
              aria-label="Collapse sidebar"
              className="sidebar-nav-toggle"
            />
          </>
        )}
        {mounted && !isOpen && (
          <DrawerButton
            state="closed"
            direction="right"
            onClick={() => setIsOpen(true)}
            aria-label="Expand sidebar"
            className="sidebar-nav-toggle sidebar-nav-toggle-collapsed"
          />
        )}
      </div>

      {mounted && (
        <Button
          type="button"
          variant="secondary"
          size="md"
          className={`sidebar-nav-new-app${!isOpen ? " sidebar-nav-new-app-collapsed" : ""}`}
        >
          <span className="sidebar-nav-plus" aria-hidden="true">+</span>
          <span className="sidebar-nav-new-app-text">New Application</span>
        </Button>
      )}

      {mounted && (
        <div className={`sidebar-nav-menus${isOpen ? "" : " sidebar-nav-menus-hidden"} flex-1`}>
          <div className="sidebar-nav-menu-wrap">
            <Menu
              size="sm"
              activeIndex={primaryActiveIndex >= 0 ? primaryActiveIndex : undefined}
              allowDeselect
              items={primaryMenuItems}
            />
          </div>

          <div className="sidebar-nav-heading">Resources</div>
          <div className="sidebar-nav-menu-wrap">
            <Menu
              size="sm"
              activeIndex={resourceActiveIndex >= 0 ? resourceActiveIndex : undefined}
              allowDeselect
              items={resourceMenuItems}
            />
          </div>
        </div>
      )}

      {mounted && (
        <div className="sidebar-nav-footer relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="relative"
            style={{ width: 40, height: 40, minWidth: 40, minHeight: 40, borderRadius: 'var(--radius-md)', backgroundColor: 'rgb(96, 165, 250)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgb(17, 24, 39)', fontWeight: '600', fontSize: '18px', border: 'none', cursor: 'pointer' }}
          >
            {initials}
          </button>
          <div className={`sidebar-nav-user-copy${isOpen ? "" : " sidebar-nav-user-copy-hidden"}`}>
            <div className="sidebar-nav-user-name">{displayName}</div>
            {organizationLabel && <div className="sidebar-nav-user-org">{organizationLabel}</div>}
          </div>

          {userMenuOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '8px',
                zIndex: 50,
                boxShadow: 'var(--shadow-md)',
                minWidth: '180px',
              }}
            >
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--color-bg-hover)] transition-colors border-b border-[var(--color-border)] flex items-center justify-between"
              >
                <span>
                  {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  onSignOut();
                }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-error)]"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

const CustomSidebar = (props: CustomSidebarProps) => <CustomSidebarInner {...props} />;

export function WorkspaceShell({ role, userSub, organizationLabel, onSignOut, children }: WorkspaceShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const identity = resolveSidebarIdentity(role, userSub, organizationLabel);
  const displayName = identity.displayName;
  const resolvedOrganizationLabel = identity.organizationLabel;
  const initials = getInitials(displayName);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const primaryItems = getPrimaryNavItems();
  const resourceItems = getResourceNavItems();

  const primaryMenuItems = primaryItems.map((item) => ({
    type: 'subtext' as const,
    label: item.label,
    subtext: '',
    href: item.href,
    onClick: () => router.push(item.href),
  }));

  const resourceMenuItems = resourceItems.map((item) => ({
    type: 'subtext' as const,
    label: item.label,
    subtext: '',
    href: item.href,
    onClick: () => router.push(item.href),
  }));

  if (!mounted) return null;

  return (
    <div className="h-screen min-h-0 overflow-hidden bg-steel-950 flex flex-col md:flex-row" suppressHydrationWarning>
      <CustomSidebar
        role={role}
        displayName={displayName}
        initials={initials}
        organizationLabel={resolvedOrganizationLabel}
        onSignOut={onSignOut}
        primaryMenuItems={primaryMenuItems}
        resourceMenuItems={resourceMenuItems}
      />

      <main className="workspace-shell-main flex-1 min-w-0 min-h-0 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1280px]">
          {children}
        </div>
      </main>
    </div>
  );
}
