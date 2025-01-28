/** @type {import('next').NextConfig} */
const nodeExternals = require('webpack-node-externals');

const nextConfig = {
  // output: "export",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.md$/,
      // This is the asset module.
      type: "asset/source",
    });
    console.log(config.externals)
    return config;
  },
};

module.exports = nextConfig;
