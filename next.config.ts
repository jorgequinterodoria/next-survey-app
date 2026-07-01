import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-lib', 'fs/promises', 'path', '@resvg/resvg-js'],
  outputFileTracingIncludes: {
    '/api/admin/export': ['./public/fonts/**/*'],
    '/api/reports/[campanaId]': ['./public/fonts/**/*'],
    '/api/**/*': ['./src/templates/**/*'],
  },
};

export default nextConfig;
