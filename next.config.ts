import type { NextConfig } from "next";

const isStaticDemoExport = process.env.DEMO_STATIC_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim();

const nextConfig: NextConfig = {
  output: isStaticDemoExport ? 'export' : 'standalone',
  trailingSlash: isStaticDemoExport,
  images: {
    unoptimized: isStaticDemoExport,
  },
  async redirects() {
    if (isStaticDemoExport) return [];
    return [
      { source: '/home', destination: '/a/home', permanent: false },
      { source: '/my-projects', destination: '/a/my-projects', permanent: false },
      { source: '/my-tasks', destination: '/a/my-tasks', permanent: false },
      { source: '/messages', destination: '/a/messages', permanent: false },
      { source: '/my-applications', destination: '/a/my-applications', permanent: false },
      { source: '/project-intake', destination: '/a/project-intake', permanent: false },
      { source: '/project-intake/synopsis', destination: '/a/project-intake/synopsis', permanent: false },
      { source: '/projects/:id', destination: '/a/projects/:id', permanent: false },
      { source: '/staff', destination: '/f/staff', permanent: false },
      { source: '/staff/admin-controls', destination: '/f/staff/admin-controls', permanent: false },
      { source: '/staff/workflow-manager', destination: '/f/staff/workflow-manager', permanent: false },
      { source: '/staff/staff-manager', destination: '/f/staff/staff-manager', permanent: false },
      { source: '/staff/modeler', destination: '/f/staff/modeler', permanent: false },
    ];
  },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
  transpilePackages: ["usds"],
};

export default nextConfig;
