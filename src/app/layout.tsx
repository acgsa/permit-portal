import type { Metadata } from "next";
import "@fontsource/space-mono/400.css";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

import { ThemeProviderComponent } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/contexts/QueryProvider";
import { USGRibbonConditional } from "@/components/USGRibbonConditional";
import { ThemeRouteScope } from "@/components/ThemeRouteScope";

export const metadata: Metadata = {
  title: "PERMIT.GOV - Federal Permit Portal",
  description: "Streamlined permit applications for federal projects and activities",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-theme="dark"
      className="bg-black"
      style={{ backgroundColor: '#000' }}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${GeistSans.variable} antialiased bg-black`} style={{ backgroundColor: '#000' }}>
        <ThemeProviderComponent>
          <ThemeRouteScope />
          <QueryProvider>
            <AuthProvider>
              <USGRibbonConditional>
                {children}
              </USGRibbonConditional>
            </AuthProvider>
          </QueryProvider>
        </ThemeProviderComponent>
      </body>
    </html>
  );
}
