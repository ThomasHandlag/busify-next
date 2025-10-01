"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaEnvelope, FaClock } from "react-icons/fa";
import { forgotPassword } from "@/lib/data/auth";
import { useTranslations } from "next-intl";

const ForgotPasswordForm = () => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const formSchema = z.object({
    email: z
      .string()
      .email(t("Form.invalidEmail"))
      .min(2)
      .max(50),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  // Fix hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  // Format countdown time to display mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!canResend) return;

    try {
      setIsLoading(true);
      setMessage("");

      // Gọi trực tiếp backend API reset password
      const response = await forgotPassword(values.email);

      if (response.code === 200) {
        setIsSuccess(true);
        setMessage(t("Auth.forgot.success"));

        // Start countdown timer (60 seconds)
        setCountdown(60);
        setCanResend(false);
      } else {
        setIsSuccess(false);
        setMessage(response.message || t("Auth.forgot.errorGeneric"));
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setIsSuccess(false);
      setMessage(t("Auth.forgot.errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (canResend) {
      form.handleSubmit(handleSubmit)();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          {/* Back button */}
          <div className="flex justify-start mb-4">
            <Link
              aria-label={t("Auth.backToLogin")}
              href="/login"
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2" size={16} />
              <span className="text-sm font-medium">{t("Auth.backToLogin")}</span>
            </Link>
          </div>

          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-white text-lg sm:text-xl" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {t("Auth.forgot.title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {t("Auth.forgot.subtitle")}
          </p>
        </div>

        {/* Forgot Password Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 sm:space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">
                    {t("Auth.emailAddress")}
                  </FormLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder={t("Home.emailPlaceholder")}
                    required
                    className="h-12 bg-muted border-input rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message display */}
            {message && (
              <div
                className={`p-4 rounded-xl text-sm ${
                  isSuccess
                    ? "bg-accent text-accent-foreground border border-accent"
                    : "bg-destructive text-destructive-foreground border border-destructive"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`flex-shrink-0 mr-2 ${
                      isSuccess ? "text-accent" : "text-destructive"
                    }`}
                  >
                    {isSuccess ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div>{message}</div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              aria-label="Submit"
              type="submit"
              disabled={isLoading || !canResend}
              className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t("Auth.forgot.sending")}
                </div>
              ) : !canResend && isMounted ? (
                <div className="flex items-center justify-center">
                  <FaClock className="mr-2" size={16} />
                  {t("Auth.forgot.resendAfter", { time: formatTime(countdown) })}
                </div>
              ) : (
                t("Auth.forgot.sendEmail")
              )}
            </Button>

            {/* Resend button (only show when countdown is finished and there was a successful send) */}
      {isMounted && isSuccess && canResend && countdown === 0 && (
              <Button
                aria-label="Resend Email"
                type="button"
                onClick={handleResend}
                variant="outline"
                className="w-full h-12 border-orange-300 text-orange-700 hover:bg-orange-50 rounded-xl transition-all duration-200"
              >
        {t("Auth.forgot.resendEmail")}
              </Button>
            )}
          </form>
        </Form>

        {/* Additional help text */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {t("Auth.forgot.notReceived")} {" "}
            <span className="text-muted-foreground">{t("Auth.forgot.checkSpam")}</span>
          </p>
        </div>

        {/* Back to login link */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            {t("Auth.forgot.remembered")} {" "}
            <Link
              aria-label={t("Auth.backToLogin")}
              href="/login"
              className="text-primary hover:text-primary/90 font-semibold"
            >
              {t("Auth.login.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
