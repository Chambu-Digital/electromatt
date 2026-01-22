/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // React compiler is now a top-level option in Next.js 16
  reactCompiler: false,
}

export default nextConfig
