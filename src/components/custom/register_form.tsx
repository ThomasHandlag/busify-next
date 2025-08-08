"use client";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "@/lib/data/auth";
import React from "react";
import Link from "next/link";
import { toast } from "sonner";
export const RegisterForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [passwordRequirements, setPasswordRequirements] = React.useState({
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
    unmetRequirements: [] as string[],
    strength: 0,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");

  // Define the form schema using Zod
  const formSchema = z
    .object({
      fullName: z.string().min(2, "Full name is required").max(50),
      email: z.string().email("Invalid email address").min(2).max(50),
      phone: z.string().optional(),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100),
      confirmPassword: z
        .string()
        .min(6, "Confirm Password must be at least 6 characters")
        .max(100),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await register({
        name: data.fullName,
        phoneNumber: data.phone ?? "",
        email: data.email,
        password: data.password,
      });

      if (response.code === 200) {
        setUserEmail(data.email);
        setRegistrationSuccess(true);
      } else {
        // Handle error
        toast.error(
          response.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkPasswordRequirements = (password: string) => {
    const requirements = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    const unmetRequirements = [];
    if (!requirements.length) unmetRequirements.push("At least 6 characters");
    if (!requirements.uppercase) unmetRequirements.push("One uppercase letter");
    if (!requirements.lowercase) unmetRequirements.push("One lowercase letter");
    if (!requirements.number) unmetRequirements.push("One number");
    if (!requirements.special) unmetRequirements.push("One special character");

    const strength = Object.values(requirements).filter(Boolean).length;

    return { requirements, unmetRequirements, strength };
  };

  const isPasswordStrong = passwordRequirements.strength >= 3;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
        {!registrationSuccess ? (
          <>
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl sm:text-2xl font-bold">
                  B
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                Join Busify today and get started
              </p>
            </div>

            {/* Register Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-5"
              >
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Full Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your full name"
                        required
                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        required
                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Phone Number
                      </FormLabel>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="Enter your phone number"
                        className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Password <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          required
                          className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                          onChange={(e) => {
                            field.onChange(e);
                            setPasswordRequirements(
                              checkPasswordRequirements(e.target.value)
                            );
                          }}
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
                      {field.value && (
                        <div className="mt-2 space-y-1">
                          {passwordRequirements.unmetRequirements.length > 0 ? (
                            passwordRequirements.unmetRequirements.map(
                              (requirement, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                                  <span className="text-xs text-red-600">
                                    {requirement}
                                  </span>
                                </div>
                              )
                            )
                          ) : (
                            <div className="flex items-center space-x-2">
                              <FaCheck className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600">
                                Password meets all requirements
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Confirm Password <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          required
                          className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
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

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1 flex-shrink-0"
                  />
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>

                {/* Newsletter Subscription */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1 flex-shrink-0"
                  />
                  <p className="text-xs sm:text-sm text-gray-600">
                    I want to receive updates and marketing communications
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isSubmitting || !isPasswordStrong}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            {/* Sign in link */}
            <div className="text-center mt-6">
              <p className="text-sm sm:text-base text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-semibold"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Security Features */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-2 text-green-700">
                <FaCheck size={16} />
                <span className="text-sm font-medium">
                  Your data is secure with us
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                We use industry-standard encryption to protect your information
              </p>
            </div>
          </>
        ) : (
          /* Success State */
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Check your email
            </h2>
            <p className="text-gray-600 mb-6">
              We&apos;ve sent a verification link to <br />
              <span className="font-semibold text-gray-800">{userEmail}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please check your email and click the verification link to
              activate your account.
            </p>
            <Button
              onClick={() => {
                setRegistrationSuccess(false);
                form.reset();
              }}
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              Register another account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
