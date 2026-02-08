/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/google-feed.xml',
        destination: '/api/google-feed',
      },
    ]
  },
}

export default nextConfig