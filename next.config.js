const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "image2url.com", // <-- add this line
      },
    ],
  },
};

export default nextConfig;