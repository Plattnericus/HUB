/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export so the site keeps working on GitHub Pages (CNAME plattnericus.dev).
  output: "export",
  // GitHub Pages has no image optimization server.
  images: { unoptimized: true },
  // Cleaner static URLs (folder/index.html) on Pages.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
