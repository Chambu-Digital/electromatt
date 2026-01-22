/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
<<<<<<< HEAD
  experimental: {
    turbo: {
      root: process.cwd(),
    },
  },
=======
  // React compiler is now a top-level option in Next.js 16
  reactCompiler: false,
>>>>>>> 9e6371980dee674cfc1bbaf9d49dc2ffac5847f7
}

export default nextConfig
