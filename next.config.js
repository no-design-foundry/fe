/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.md$/,
      // This is the asset module.
      type: "asset/source",
    });
    return config;
  },
};

module.exports = nextConfig;
