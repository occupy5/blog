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
};

export default withMDX(config);
