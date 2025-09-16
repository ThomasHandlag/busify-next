"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FormEvent } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const LoginForm = () => {
  const t = useTranslations();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGoogleLoading] = React.useState(false);
  const [showResendModal, setShowResendModal] = React.useState(false);
  const [resendEmail, setResendEmail] = React.useState("");
  const [resendStatus, setResendStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [resendMessage, setResendMessage] = React.useState("");
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const formSchema = z.object({
    email: z.email(t("Auth.login.invalidEmail")).min(2).max(50),
    password: z.string().min(6, t("Auth.login.invalidPassword")).max(100),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await signIn("credentials", {
        redirect: false, // Quan trọng: ngăn tự động redirect
        username: form.getValues("email"),
        password: form.getValues("password"),
      });

      console.log("SignIn result:", result); // Debug log

      if (result?.ok && !result?.error) {
        console.log("Login successful, redirecting...");
        router.back();
      } else {
        console.error("Login failed:", result?.error);
        toast.error(t("Auth.login.errorMessage"));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail.trim()) {
      setResendStatus("error");
      setResendMessage("Please enter your email address");
      return;
    }

    try {
      setResendStatus("loading");

      const response = await fetch(
        "http://localhost:8080/api/auth/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: resendEmail }),
        }
      );

      if (response.ok) {
        setResendStatus("success");
        setResendMessage(t("Auth.login.resendSuccess"));
      } else {
        setResendStatus("error");
        setResendMessage(t("Auth.login.resendError"));
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      setResendStatus("error");
      setResendMessage(t("Auth.login.resendError"));
    }
  };

  const resetResendModal = () => {
    setShowResendModal(false);
    setResendEmail("");
    setResendStatus("idle");
    setResendMessage("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl sm:text-2xl font-bold">B</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {t("Auth.login.title")}
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            {t("Auth.login.subtitle")}
          </p>
        </div>

        {/* Social Login Buttons */}

        {/* Login Form */}
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    {t("Auth.emailAddress")}
                  </FormLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder={t("Auth.emailAddress")}
                    required
                    className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    {t("Auth.password")}
                  </FormLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("Auth.password")}
                      required
                      className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember me & Forgot password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {t("Auth.login.rememberMe")}
                </span>
              </label>
              <Link
                aria-label="Forgot password"
                href="/forgot-password"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {t("Auth.forgotPassword")}
              </Link>
            </div>

            <Button
              aria-label="Sign In"
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              {t("Auth.login.signIn")}
            </Button>
          </form>
        </Form>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
          <button
            onClick={() => signIn("google")}
            disabled={isGoogleLoading || !isMounted}
            className="flex items-center justify-center py-3 px-2 sm:px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t("Auth.login.google")}
          >
            {isMounted && isGoogleLoading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
            ) : (
              <FcGoogle size={20} />
            )}
          </button>

          <button
            className="flex items-center justify-center py-3 px-2 sm:px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            aria-label={t("Auth.login.facebook")}
          >
            <FaFacebook size={20} className="text-blue-600" />
          </button>

          <button
            className="flex items-center justify-center py-3 px-2 sm:px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            aria-label={t("Auth.login.github")}
          >
            <FaGithub size={20} className="text-gray-800" />
          </button>
        </div>

        {/* Sign up link */}
        <div className="text-center mt-6">
          <p className="text-sm sm:text-base text-gray-600">
            {t("Auth.dontHaveAccount")}{" "}
            <Link
              aria-label="Sign up"
              href="/signup"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              {t("Auth.createAccount")}
            </Link>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Haven&apos;t received verification email?{" "}
            <button
              onClick={() => setShowResendModal(true)}
              className="text-green-600 hover:text-green-700 font-semibold underline"
            >
              {t("Auth.login.resendVerification")}
            </button>
          </p>
        </div>

        {/* Resend Verification Modal */}
        {showResendModal && (
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t("Auth.verifyEmail")}
                </h3>
                <p className="text-gray-600 text-sm">
                  Enter your email address to receive a new verification link
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Auth.emailAddress")}
                  </label>
                  <Input
                    type="email"
                    placeholder={t("Auth.emailAddress")}
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {resendMessage && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      resendStatus === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {resendMessage}
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    aria-label="Cancel"
                    onClick={resetResendModal}
                    variant="outline"
                    className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {t("Common.cancel")}
                  </Button>
                  <Button
                    aria-label="Send Email"
                    onClick={handleResendVerification}
                    disabled={resendStatus === "loading"}
                    className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    {resendStatus === "loading" ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t("Auth.login.signingIn")}
                      </div>
                    ) : (
                      "Send Email"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
