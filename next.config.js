/** @type {import('next').NextConfig} */

module.exports = {
  nextConfig: {},
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
};