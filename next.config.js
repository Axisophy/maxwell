/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sdo.gsfc.nasa.gov',
      },
    ],
  },
}

module.exports = nextConfig
