/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Exclude chat page from static generation
  async rewrites() {
    return [
      {
        source: '/api/upload',
        destination: 'http://3.143.227.59:8000/upload/',
      },
      {
        source: '/api/chat',
        destination: 'http://3.143.227.59:8000/query/',
      },
    ];
  },
};

export default nextConfig;
