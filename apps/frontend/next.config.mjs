/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@vibe/core", "@vibe/icons", "@devcycle/shared"],
};

export default nextConfig;
