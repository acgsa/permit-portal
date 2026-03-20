import type { NextConfig } from "next";

const isStaticDemoExport = process.env.DEMO_STATIC_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim();

const nextConfig: NextConfig = {
  output: isStaticDemoExport ? 'export' : 'standalone',
  trailingSlash: isStaticDemoExport,
  images: {
    unoptimized: isStaticDemoExport,
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
