import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-lib', 'fs/promises', 'path'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./src/templates/**/*', './public/fonts/**/*'],
  },
};

export default nextConfig;
