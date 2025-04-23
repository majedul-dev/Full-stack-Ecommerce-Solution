/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable ESLint during builds to avoid serialization errors
    eslint: {
      ignoreDuringBuilds: true,
    },
    
    // Enable React Strict Mode for better error detection
    reactStrictMode: true,
    
    // Configure proper handling for static exports if needed
    output: 'standalone', // or 'export' if you're doing static export
    
    // Enable experimental features if you're using them
    experimental: {
      // Required for some App Router features
      serverActions: true,
      
      // Helps with Suspense boundaries
      optimizePackageImports: [
        '@headlessui/react'
      ],
      
      // Improves performance
      serverComponentsExternalPackages: ['mongoose'], // Add your DB client if needed
    },
    
    // Add webpack config to handle potential client/server mismatches
    webpack: (config) => {
      config.resolve = {
        ...config.resolve,
        // This helps with some dependency resolution issues
        extensionAlias: {
          '.js': ['.js', '.ts', '.tsx'],
        },
      };
      return config;
    }
  };
  
  export default nextConfig;