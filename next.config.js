/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const SERVER_URL = process.env.SERVER;
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: "/:slug",
        destination: `${SERVER_URL}/url/redirect/:slug`,
      },
      {
        source: "/c/:slug",
        destination: `${SERVER_URL}/custom/redirect/:slug`,
      },
      {
        source: "/t/:slug/raw",
        destination: `${SERVER_URL}/text/raw/:slug`,
      },
      {
        source: "/api/:path*",
        destination: `${SERVER_URL}/:path*`,
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
