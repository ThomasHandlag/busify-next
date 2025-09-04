"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function GoogleLoginHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Processing Google login...");

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const email = searchParams.get("email");

        if (!accessToken) {
          setStatus("error");
          setMessage("No access token received");
          setTimeout(() => router.push("/login"), 3000);
          return;
        }

        setMessage("Creating session...");

        // Tạo NextAuth session với Google tokens
        const result = await signIn("credentials", {
          redirect: false,
          username: email || "google_user",
          password: "google_oauth", // Placeholder
          accessToken: accessToken,
          refreshToken: refreshToken || "",
        });

        if (result?.ok && !result?.error) {
          setStatus("success");
          setMessage("Login successful! Redirecting to homepage...");
          setTimeout(() => router.push("/"), 1500);
        } else {
          console.error("NextAuth signIn failed:", result?.error);
          throw new Error(result?.error || "Failed to create session");
        }
      } catch (error) {
        console.error("Google login handler error:", error);
        setStatus("error");
        setMessage("Failed to complete Google login");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleGoogleLogin();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center mx-auto">
        {status === "loading" && (
          <div className="space-y-6">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Processing...
              </h2>
              <p className="text-gray-600">{message}</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-green-800">Welcome!</h2>
              <p className="text-gray-600">{message}</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-red-800">Error</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
