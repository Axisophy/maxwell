/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sdo.gsfc.nasa.gov',
      },
      {
        protocol: 'https',
        hostname: 'images-assets.nasa.gov',
      },
      {
        protocol: 'https',
        hostname: 'soho.nascom.nasa.gov',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/observe/solar-observatory',
        destination: '/observe/space/solar-observatory',
        permanent: true,
      },
      {
        source: '/observe/moon',
        destination: '/observe/space/lunar-atlas',
        permanent: true,
      },
      {
        source: '/data/unrest',
        destination: '/observe/earth/unrest',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
