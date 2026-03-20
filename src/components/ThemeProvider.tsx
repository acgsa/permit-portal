'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export { useTheme } from 'next-themes';

export function ThemeProviderComponent({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
