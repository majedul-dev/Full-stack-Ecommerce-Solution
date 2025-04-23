/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    serverActions: {}, // Changed from boolean to empty object
    optimizePackageImports: [
      '@headlessui/react',
      'react-day-picker'
    ],
  },
  serverExternalPackages: ['mongoose'], // Moved from experimental
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      extensionAlias: {
        '.js': ['.js', '.ts', '.tsx'],
      },
    };
    return config;
  }
};

export default nextConfig;