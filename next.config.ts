import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/**/*': ['./src/templates/**/*'],
  },
};

export default nextConfig;
