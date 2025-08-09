import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   env: {
     NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "my_something_is_not_secret_at_all"
   },
};

export default nextConfig;
