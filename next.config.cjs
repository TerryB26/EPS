/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/Flexify/:path*',
        destination: 'http://185.220.204.117:2606/Flexify/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;