
'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, DrawerButton, Button, Avatar } from 'usds';
import { Building2, CircleHelp, CreditCard, FileText, FolderOpen, Home, Landmark, ListTodo, LogOut, MessageSquare, Moon, Network, Sun, Wrench } from 'lucide-react';
import { GearIcon, MenuIcon, XMarkIcon } from './Icons';
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
  icon?: React.ReactNode;
};

const PORTAL_THEME_STORAGE_KEY = 'permit.portal.theme';

type SidebarAvatarTone = 'green' | 'gold' | 'blue-400' | 'turquoise';

function getSidebarAvatarTone(role?: string, userSub?: string): SidebarAvatarTone {
  if (role === 'admin') return 'green';

  if (role === 'staff') {
    const profile = resolveStaffProfile(userSub, role);
    return profile.title.toLowerCase().includes('regional manager') ? 'gold' : 'turquoise';
  }

  return 'blue-400';
}

function getUsdsAvatarColor(tone: SidebarAvatarTone): 'green' | 'gold' | 'blue-400' {
  return tone === 'turquoise' ? 'blue-400' : tone;
}

function getPrimaryNavItems(role?: string, userSub?: string): NavItem[] {
  if (role === 'admin') {
    return [
      { label: 'Dashboard', href: '/f/dashboard', icon: <Home size={16} /> },
      { label: 'Projects', href: '/f/projects', icon: <FolderOpen size={16} /> },
      { label: 'Payments', href: '/f/staff/payments', icon: <CreditCard size={16} /> },
      { label: 'Workflows', href: '/f/staff/workflow-manager', icon: <Network size={16} /> },
      { label: 'Admin Controls', href: '/f/staff/admin-controls', icon: <GearIcon size={16} /> },
    ];
  }

  if (role === 'staff') {
    const profile = resolveStaffProfile(userSub, role);
    const isRegionalManager = profile.title.toLowerCase().includes('regional manager');
    const staffItems: NavItem[] = [
      { label: 'Dashboard', href: '/f/dashboard', icon: <Home size={16} /> },
      { label: 'Projects', href: '/f/projects', icon: <FolderOpen size={16} /> },
      ...(isRegionalManager ? [{ label: 'Staff Manager', href: '/f/staff/staff-manager', icon: <Building2 size={16} /> }] : []),
      { label: 'My Tasks', href: '/f/my-tasks', icon: <ListTodo size={16} /> },
      { label: 'Messages', href: '/f/messages', icon: <MessageSquare size={16} /> },
      { label: 'Workflows', href: '/f/staff/workflow-manager', icon: <Network size={16} /> },
    ];
    return staffItems;
  }

  return [
    { label: 'Home', href: '/a/home', icon: <Home size={16} /> },
    { label: 'My Projects', href: '/a/my-projects', icon: <Building2 size={16} /> },
    { label: 'My Tasks', href: '/a/my-tasks', icon: <ListTodo size={16} /> },
    { label: 'Messages', href: '/a/messages', icon: <MessageSquare size={16} /> },
  ];
}

function getResourceNavItems(role?: string): NavItem[] {
  const isPortalStaff = role === 'staff' || role === 'admin';
  const basePrefix = isPortalStaff ? '/f' : '/a';
  const items: NavItem[] = isPortalStaff
    ? [
        { label: 'Permit Types', href: `${basePrefix}/permit-types`, icon: <FileText size={16} /> },
        { label: 'Regulations', href: `${basePrefix}/regulations`, icon: <Landmark size={16} /> },
        { label: 'Tools', href: `${basePrefix}/resources`, icon: <Wrench size={16} /> },
      ]
    : [
        { label: 'Permit Types', href: `${basePrefix}/permit-types`, icon: <FileText size={16} /> },
        { label: 'Regulations', href: `${basePrefix}/regulations`, icon: <Landmark size={16} /> },
        { label: 'Tools', href: `${basePrefix}/resources`, icon: <Wrench size={16} /> },
      ];
  if (isPortalStaff) {
    items.push({ label: 'API', href: '/api', icon: <FileText size={16} /> });
  }
  items.push(
    isPortalStaff
      ? { label: 'Help Center', href: `${basePrefix}/help-center`, icon: <CircleHelp size={16} /> }
      : { label: 'Help Center', href: `${basePrefix}/help-center`, icon: <CircleHelp size={16} /> },
  );
  return items;
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

type SidebarMenuItem =
  | {
      type: 'subtext';
      label: string;
      subtext: string;
      href: string;
      onClick?: () => void;
    }
  | {
      type: 'icon';
      label: string;
      icon: React.ReactNode;
      href: string;
      onClick?: () => void;
    };

interface AvatarMenuItem {
  type: 'icon';
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface CustomSidebarProps {
  displayName: string;
  initials: string;
  avatarTone: SidebarAvatarTone;
  organizationLabel?: string;
  onSignOut: () => void;
  primaryMenuItems: SidebarMenuItem[];
  resourceMenuItems: SidebarMenuItem[];
}

function CustomSidebarInner({
  displayName,
  initials,
  avatarTone,
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
  const USER_MENU_RIGHT_INSET = 12;
  const userMenuWidth = isOpen ? 184 : 220;
  const sidebarRef = useRef<HTMLElement>(null);
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
  const isFederalPath = currentPath === '/f' || currentPath.startsWith('/f/');
  const portalPrefix = isFederalPath ? '/f' : '/a';
  const settingsHref = `${portalPrefix}/settings`;
  const newProjectHref = isFederalPath ? '/f/dashboard' : '/a/project-intake';

  const matchesNavHref = (href: string): boolean => {
    if (href === '/a/home' || href === '/f/dashboard') return currentPath === href;
    return currentPath === href || currentPath.startsWith(`${href}/`);
  };

  const primaryActiveIndex = primaryMenuItems.findIndex((item) => matchesNavHref(item.href));
  const resourceActiveIndex = resourceMenuItems.findIndex((item) => matchesNavHref(item.href));
  const avatarColor = getUsdsAvatarColor(avatarTone);
  const showCollapsedIconMenu = !isOpen;

  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    window.localStorage.setItem(PORTAL_THEME_STORAGE_KEY, newTheme);
    htmlElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  };

  const userMenuItems: AvatarMenuItem[] = [
    {
      type: 'icon',
      label: 'Settings',
      icon: <GearIcon size={16} />,
      onClick: () => {
        setUserMenuOpen(false);
        router.push(settingsHref);
      },
    },
    {
      type: 'icon',
      label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
      icon: theme === 'light' ? <Moon size={16} /> : <Sun size={16} />,
      onClick: () => {
        toggleTheme();
        setUserMenuOpen(false);
      },
    },
    {
      type: 'icon',
      label: 'Log Out',
      icon: <LogOut size={16} />,
      onClick: () => {
        setUserMenuOpen(false);
        onSignOut();
      },
    },
  ];

  return (
    <aside ref={sidebarRef} className={`sidebar-nav-panel${isOpen ? "" : " sidebar-nav-panel-closed"}`} aria-label="Sidebar navigation panel" style={{ width: isOpen ? 200 : 66, border: 'none', borderRadius: '0', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }} suppressHydrationWarning>
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
        onClick={() => router.push(newProjectHref)}
      >
        <span className="sidebar-nav-plus" aria-hidden="true">+</span>
        <span className="sidebar-nav-new-app-text">New Project</span>
      </Button>

      <div
        className={`sidebar-nav-menus${!isOpen && !showCollapsedIconMenu ? " sidebar-nav-menus-hidden" : ""}${showCollapsedIconMenu ? " sidebar-nav-menus-icons-only" : ""} flex-1`}
      >
        <div className="sidebar-nav-menu-wrap">
          <Menu
            size="sm"
            activeIndex={primaryActiveIndex >= 0 ? primaryActiveIndex : undefined}
            allowDeselect
            items={primaryMenuItems}
          />
        </div>

        <div className="sidebar-nav-heading">Resources</div>
        <div className={`sidebar-nav-menu-wrap${showCollapsedIconMenu ? " sidebar-nav-menu-wrap-resources" : ""}`}>
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
              const panelRect = sidebarRef.current?.getBoundingClientRect();
              const alignedLeft =
                isOpen && panelRect
                  ? Math.max(8, panelRect.right - userMenuWidth - USER_MENU_RIGHT_INSET)
                  : rect.left;
              setMenuPos({
                bottom: window.innerHeight - rect.top + 8,
                left: alignedLeft,
              });
            }
            setUserMenuOpen(!userMenuOpen);
          }}
          className={`relative${avatarTone === 'turquoise' ? ' avatar-tone-turquoise' : ''}`}
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
            className="sidebar-nav-user-menu"
            style={{
              position: 'fixed',
              bottom: menuPos.bottom,
              left: menuPos.left,
              zIndex: 9999,
              width: `${userMenuWidth}px`,
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
  const isFederalPortalPath = pathname === '/f' || pathname.startsWith('/f/');
  const newProjectHref = isFederalPortalPath ? '/f/dashboard' : '/a/project-intake';
  const identity = resolveSidebarIdentity(role, userSub, organizationLabel);
  const displayName = identity.displayName;
  const resolvedOrganizationLabel = identity.organizationLabel;
  const initials = getInitials(displayName);
  const avatarTone = getSidebarAvatarTone(role, userSub);
  const avatarColor = getUsdsAvatarColor(avatarTone);
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
  const resourceItems = getResourceNavItems(role);

  const primaryMenuItems = primaryItems.map((item) =>
    item.icon
      ? {
          type: 'icon' as const,
          label: item.label,
          icon: item.icon,
          href: item.href,
          onClick: () => router.push(item.href),
        }
      : {
          type: 'subtext' as const,
          label: item.label,
          subtext: '',
          href: item.href,
          onClick: () => router.push(item.href),
        },
  );

  const resourceMenuItems = resourceItems.map((item) =>
    item.icon
      ? {
          type: 'icon' as const,
          label: item.label,
          icon: item.icon,
          href: item.href,
          onClick: () => router.push(item.href),
        }
      : {
          type: 'subtext' as const,
          label: item.label,
          subtext: '',
          href: item.href,
          onClick: () => router.push(item.href),
        },
  );

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
        <div className={`w-10 h-10 flex items-center justify-center${avatarTone === 'turquoise' ? ' avatar-tone-turquoise' : ''}`}>
          <Avatar initials={initials} size="sm" shape="square" color={avatarColor} />
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
                onClick={() => router.push(newProjectHref)}
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

            <div className={`px-4 py-3 border-t border-[var(--color-border)] flex items-center gap-[var(--space-xs)]${avatarTone === 'turquoise' ? ' avatar-tone-turquoise' : ''}`}>
              <Avatar initials={initials} size="md" shape="square" color={avatarColor} />
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
            displayName={displayName}
            initials={initials}
            avatarTone={avatarTone}
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
