const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.imageurlgenerator.com",
      },
      {
        protocol: "https",
        hostname: "image2url.com",
      },
    ],
  },
};

export default nextConfig;