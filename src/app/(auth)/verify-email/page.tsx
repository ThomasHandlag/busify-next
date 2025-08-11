"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { verification } from "@/lib/data/auth";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">B</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Busify</h1>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Loading...
            </h2>
            <p className="text-gray-600">
              Please wait while we load the verification page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerifyEmailContent() {
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | "expired"
  >("loading");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationStatus("error");
        setMessage("Invalid verification link. No token provided.");
        return;
      }

      try {
        const response = await verification(token);

        if (response.code === 200) {
          setVerificationStatus("success");
          setMessage(
            response.message || "Your email has been verified successfully."
          );
        } else {
          setVerificationStatus("error");
          setMessage(
            response.message || "Email verification failed. Please try again."
          );
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus("error");
        setMessage("An error occurred during verification. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  const handleContinue = () => {
    router.push("/login");
  };

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      setResendMessage("");

      // Extract email từ token hoặc yêu cầu user nhập email
      // Ở đây tôi sẽ tạo một prompt đơn giản
      const email = prompt("Please enter your email address:");

      if (!email) {
        setIsResending(false);
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/auth/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResendMessage(
          "Verification email sent successfully! Please check your inbox."
        );
      } else {
        setResendMessage(data.message || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      setResendMessage("An error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Verifying your email...
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <p className="text-sm text-gray-500 mb-8">
              Your account is now active. You can sign in and start using
              Busify.
            </p>
            <Button
              onClick={handleContinue}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Continue to Sign In
            </Button>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600"
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
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <div className="space-y-4">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                Try Again
              </Button>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full text-green-600 border-green-600 hover:bg-green-50 font-semibold py-3 rounded-xl"
                >
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        );

      case "expired":
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.314 14.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Link Expired
            </h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <div className="space-y-4">
              <Button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                {isResending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Resend Verification Email"
                )}
              </Button>
              {resendMessage && (
                <div
                  className={`p-3 rounded-lg text-sm text-center ${
                    resendMessage.includes("successfully")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {resendMessage}
                </div>
              )}
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full text-green-600 border-green-600 hover:bg-green-50 font-semibold py-3 rounded-xl"
                >
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">B</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Busify</h1>
          </div>

          {/* Content */}
          {renderContent()}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Need help? Contact our{" "}
              <a
                href="#"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
