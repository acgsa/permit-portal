'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { getToken, isTokenValid } from '@/lib/auth';

const PORTAL_THEME_STORAGE_KEY = 'permit.portal.theme';

function isPortalRoute(pathname: string): boolean {
  // Keep the logged-out staff login page in the public (dark) theme.
  if (pathname === '/staff') {
    return false;
  }

  const portalPrefixes = [
    '/home',
    '/my-applications',
    '/my-tasks',
    '/messages',
    '/permit-types',
    '/regulations',
    '/resources',
    '/help-center',
    '/dashboard',
    '/staff',
    '/applications',
    '/my-projects',
    '/projects',
  ];

  return portalPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function ThemeRouteScope() {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  useEffect(() => {
    const htmlElement = document.documentElement;
    const isLoggedIn = isTokenValid(getToken());

    const isProjectIntake = pathname === '/project-intake' || pathname.startsWith('/project-intake/');

    // Logged-out project intake is forced to light mode.
    if (isProjectIntake && !isLoggedIn) {
      setTheme('light');
      htmlElement.setAttribute('data-theme', 'light');
      htmlElement.style.backgroundColor = '';
      htmlElement.classList.remove('bg-black');
      document.body.style.backgroundColor = '';
      document.body.classList.remove('bg-black');
      return;
    }

    // Restore dark bg classes for all other logged-out routes.
    if (!isLoggedIn) {
      htmlElement.style.backgroundColor = '#000';
      if (!htmlElement.classList.contains('bg-black')) htmlElement.classList.add('bg-black');
      document.body.style.backgroundColor = '#000';
      if (!document.body.classList.contains('bg-black')) document.body.classList.add('bg-black');
    }

    // Logged-out experience should always remain dark, including any portal route.
    if (!isLoggedIn) {
      setTheme('dark');
      htmlElement.setAttribute('data-theme', 'dark');
      return;
    }

    if (isPortalRoute(pathname) || (isLoggedIn && isProjectIntake)) {
      const savedTheme = window.localStorage.getItem(PORTAL_THEME_STORAGE_KEY);
      const nextTheme = savedTheme === 'light' ? 'light' : 'dark';
      setTheme(nextTheme);
      htmlElement.setAttribute('data-theme', nextTheme);
      return;
    }

    // Keep logged-out and screener flows in dark mode regardless of portal preference.
    setTheme('dark');
    htmlElement.setAttribute('data-theme', 'dark');
  }, [pathname, setTheme]);

  return null;
}

export default ThemeRouteScope;
