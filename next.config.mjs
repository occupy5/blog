import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  serverExternalPackages: ['typescript', 'twoslash', '@takumi-rs/core'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog-assets.shenn.xyz',
      },
    ],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/list', destination: '/', permanent: true },
      { source: '/list/:page(\\d+)', destination: '/', permanent: true },
    ];
  },
};

export default withMDX(config);
