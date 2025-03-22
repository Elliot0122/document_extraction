/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  // Exclude chat page from static generation
  async rewrites() {
    return [
      {
        source: '/api/chat',
        destination: 'http://localhost:8000/ask',
      },
    ];
  },
};

export default nextConfig;
