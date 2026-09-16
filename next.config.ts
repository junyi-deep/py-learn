import type { NextConfig } from 'next';

const nextConfig: NextConfig = process.env.PYPATH_PORTABLE === '1' ? { output: 'standalone' } : {};

export default nextConfig;
