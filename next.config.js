/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
      {
        source: '/admin/:path*', // Also proxy any sub-paths under /admin if needed by DecapCMS
        destination: '/admin/:path*', // This ensures assets like config.yml are still served from public/admin
      },
    ];
  },
};

module.exports = nextConfig;
