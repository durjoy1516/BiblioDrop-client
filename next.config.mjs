/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co", // ImgBB এর ছবির জন্য
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Auth অবতারের জন্য
      },
    ],
  },
};

export default nextConfig;