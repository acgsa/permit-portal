
'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, DrawerButton, Button, Avatar } from 'usds';
import { MenuIcon, XMarkIcon } from './Icons';
import ceqSeal from '@/logo/US-CouncilOnEnvironmentalQuality-Seal.svg';
import { resolveStaffProfile } from '@/lib/mockFederalPortalData';

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

const PORTAL_THEME_STORAGE_KEY = 'permit.portal.theme';

function getPrimaryNavItems(role?: string, userSub?: string): NavItem[] {
  if (role === 'admin') {
    return [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Workflow Manager', href: '/staff/workflow-manager' },
      { label: 'Admin Controls', href: '/staff/admin-controls' },
    ];
  }

  if (role === 'staff') {
    const profile = resolveStaffProfile(userSub, role);
    const isRegionalManager = profile.title.toLowerCase().includes('regional manager');
    const staffItems: NavItem[] = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Workflow Manager', href: '/staff/workflow-manager' },
      ...(isRegionalManager ? [{ label: 'Staff Manager', href: '/staff/staff-manager' }] : []),
      { label: 'My Tasks', href: '/my-tasks' },
      { label: 'Messages', href: '/messages' },
    ];
    return staffItems;
  }

  return [
    { label: 'Home', href: '/home' },
    { label: 'My Projects', href: '/my-projects' },
    { label: 'My Tasks', href: '/my-tasks' },
    { label: 'Messages', href: '/messages' },
  ];
}

function getResourceNavItems(): NavItem[] {
  return [
    { label: 'Permit Types', href: '/permit-types' },
    { label: 'Regulations', href: '/regulations' },
    { label: 'Tools', href: '/resources' },
    { label: 'Help Center', href: '/help-center' },
  ];
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
  if (role === 'staff' || role === 'admin') {
    const profile = resolveStaffProfile(userSub, role);
    return {
      displayName: profile.displayName,
      organizationLabel: profile.agency,
    };
  }

  if (!userSub) {
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
  <Image src={ceqSeal} alt="Council on Environmental Quality seal" width={size} height={size} className="object-contain" priority />
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const savedTheme = window.localStorage.getItem(PORTAL_THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    const currentTheme = document.documentElement.getAttribute('data-theme');
    return currentTheme === 'dark' ? 'dark' : 'light';
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ bottom: number; left: number }>({ bottom: 60, left: 8 });
  const avatarRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        avatarRef.current && !avatarRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  const currentPath = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;

  const matchesNavHref = (href: string): boolean => {
    if (href === '/home') return currentPath === '/home';
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  const primaryActiveIndex = primaryMenuItems.findIndex((item) => matchesNavHref(item.href));
  const resourceActiveIndex = resourceMenuItems.findIndex((item) => matchesNavHref(item.href));
  const avatarColor = role === 'admin' ? 'green' : role === 'staff' ? 'gold' : 'blue-400';

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    window.localStorage.setItem(PORTAL_THEME_STORAGE_KEY, newTheme);
    htmlElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  };

  const userMenuItems: MenuItem[] = [
    {
      type: 'subtext',
      label: 'Settings',
      subtext: '',
      href: '/settings',
      onClick: () => {
        setUserMenuOpen(false);
        router.push('/settings');
      },
    },
    {
      type: 'subtext',
      label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
      subtext: '',
      href: '#',
      onClick: () => {
        toggleTheme();
        setUserMenuOpen(false);
      },
    },
    {
      type: 'subtext',
      label: 'Sign Out',
      subtext: '',
      href: '#',
      onClick: () => {
        setUserMenuOpen(false);
        onSignOut();
      },
    },
  ];

  return (
    <aside className={`sidebar-nav-panel${isOpen ? "" : " sidebar-nav-panel-closed"}`} aria-label="Sidebar navigation panel" style={{ width: isOpen ? 200 : 66, border: 'none', borderRadius: '0', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }} suppressHydrationWarning>
      <div className="sidebar-nav-panel-top">
        {isOpen && (
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
        {!isOpen && (
          <DrawerButton
            state="closed"
            direction="right"
            onClick={() => setIsOpen(true)}
            aria-label="Expand sidebar"
            className="sidebar-nav-toggle sidebar-nav-toggle-collapsed"
          />
        )}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="md"
        className={`sidebar-nav-new-app${!isOpen ? " sidebar-nav-new-app-collapsed" : ""}`}
        onClick={() => router.push('/project-intake')}
      >
        <span className="sidebar-nav-plus" aria-hidden="true">+</span>
        <span className="sidebar-nav-new-app-text">New Project</span>
      </Button>

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

      <div className="sidebar-nav-footer relative">
        <button
          ref={avatarRef}
          type="button"
          onClick={() => {
            if (!userMenuOpen && avatarRef.current) {
              const rect = avatarRef.current.getBoundingClientRect();
              setMenuPos({
                bottom: window.innerHeight - rect.top + 8,
                left: rect.left,
              });
            }
            setUserMenuOpen(!userMenuOpen);
          }}
          className="relative"
          style={{ width: 40, height: 40, minWidth: 40, minHeight: 40, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <Avatar initials={initials} size="md" shape="square" color={avatarColor} />
        </button>
        <div className={`sidebar-nav-user-copy${isOpen ? "" : " sidebar-nav-user-copy-hidden"}`}>
          <div className="sidebar-nav-user-name">{displayName}</div>
          {organizationLabel && <div className="sidebar-nav-user-org truncate">{organizationLabel}</div>}
        </div>

        {userMenuOpen && (
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              bottom: menuPos.bottom,
              left: menuPos.left,
              zIndex: 9999,
              minWidth: '220px',
            }}
          >
            <Menu size="sm" items={userMenuItems} />
          </div>
        )}
      </div>
    </aside>
  );
}

const CustomSidebar = (props: CustomSidebarProps) => <CustomSidebarInner {...props} />;

export function WorkspaceShell({ role, userSub, organizationLabel, onSignOut, children }: WorkspaceShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const identity = resolveSidebarIdentity(role, userSub, organizationLabel);
  const displayName = identity.displayName;
  const resolvedOrganizationLabel = identity.organizationLabel;
  const initials = getInitials(displayName);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll — only the main content area should scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [mobileMenuOpen]);

  const primaryItems = getPrimaryNavItems(role, userSub);
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

  return (
    <div className="h-screen min-h-0 overflow-hidden bg-[var(--color-bg)] flex flex-col" suppressHydrationWarning>
      {/* Mobile top bar - visible only on small screens */}
      <header className="flex md:hidden items-center justify-between h-14 px-4 bg-[var(--color-bg-muted)] border-b border-[var(--color-border)] shrink-0 z-40">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)]"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <XMarkIcon size={24} className="text-[var(--color-text)]" />
          ) : (
            <MenuIcon size={24} className="text-[var(--color-text)]" />
          )}
        </button>
        <FPPLogo size={32} />
        <div className="w-10 h-10 flex items-center justify-center">
          <Avatar initials={initials} size="sm" shape="square" color={role === 'admin' ? 'green' : role === 'staff' ? 'gold' : 'blue-400'} />
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-[260px] bg-[var(--color-bg-muted)] overflow-y-auto flex flex-col animate-slide-in-left"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--color-border)] shrink-0">
              <FPPLogo size={32} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-10 h-10"
                aria-label="Close menu"
              >
                <XMarkIcon size={24} className="text-[var(--color-text)]" />
              </button>
            </div>

            <div className="flex-1 px-2 py-4 flex flex-col gap-[var(--space-sm)]">
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="sidebar-nav-new-app w-full"
                onClick={() => router.push('/project-intake')}
              >
                <span className="sidebar-nav-plus" aria-hidden="true">+</span>
                <span className="sidebar-nav-new-app-text">New Project</span>
              </Button>

              <div className="sidebar-nav-menu-wrap">
                <Menu size="sm" items={primaryMenuItems} />
              </div>

              <div className="sidebar-nav-heading">Resources</div>
              <div className="sidebar-nav-menu-wrap">
                <Menu size="sm" items={resourceMenuItems} />
              </div>
            </div>

            <div className="px-4 py-3 border-t border-[var(--color-border)] flex items-center gap-[var(--space-xs)]">
              <Avatar initials={initials} size="md" shape="square" color={role === 'admin' ? 'green' : role === 'staff' ? 'gold' : 'blue-400'} />
              <div className="min-w-0 flex-1">
                <div className="sidebar-nav-user-name truncate">{displayName}</div>
                {resolvedOrganizationLabel && <div className="sidebar-nav-user-org truncate">{resolvedOrganizationLabel}</div>}
              </div>
            </div>

            <div className="px-4 pb-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
              >
                Sign Out
              </Button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-row overflow-hidden">
        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden md:flex h-full shrink-0 overflow-visible">
          <CustomSidebar
            role={role}
            displayName={displayName}
            initials={initials}
            organizationLabel={resolvedOrganizationLabel}
            onSignOut={onSignOut}
            primaryMenuItems={primaryMenuItems}
            resourceMenuItems={resourceMenuItems}
          />
        </div>

        <main className="workspace-shell-main flex-1 min-w-0 min-h-0 overflow-y-auto">
          <div className="workspace-shell-main-frame mx-auto w-full max-w-[1120px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
