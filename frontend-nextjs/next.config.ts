import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* Cấu hình cho phép Next/Image tải hình ảnh từ các domain bên ngoài an toàn */
  images: {
    remotePatterns: [
      // Cho phép tải ảnh avatar/banner mẫu từ Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Cho phép tải ảnh đại diện từ tài khoản Google (khi đăng nhập Google One Tap)
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
