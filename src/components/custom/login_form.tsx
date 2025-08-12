// "use client";
// import { useForm } from "react-hook-form";
// import { Button } from "../ui/button";
// import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
// import { Input } from "../ui/input";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { FormEvent } from "react";
// import Link from "next/link";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// const LoginForm = () => {
//   const [showPassword, setShowPassword] = React.useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
//   const [showResendModal, setShowResendModal] = React.useState(false);
//   const [loginLoading, setLoginLoading] = React.useState(false);
//   const [resendEmail, setResendEmail] = React.useState("");
//   const [resendStatus, setResendStatus] = React.useState<
//     "idle" | "loading" | "success" | "error"
//   >("idle");
//   const [resendMessage, setResendMessage] = React.useState("");

//   const router = useRouter();
//   const formSchema = z.object({
//     email: z.email("Invalid email address").min(2).max(50),
//     password: z
//       .string()
//       .min(6, "Password must be at least 6 characters")
//       .max(100),
//   });
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     mode: "onChange",
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const handleSubmit = async (e: FormEvent) => {
//     setLoginLoading(true);
//     e.preventDefault();

//     try {
//       const result = await signIn("credentials", {
//         redirect: false, // Quan trọng: ngăn tự động redirect
//         username: form.getValues("email"),
//         password: form.getValues("password"),
//       });

//       console.log("SignIn result:", result); // Debug log

//       if (result?.ok && !result?.error) {
//         console.log("Login successful, redirecting...");
//         router.push("/");
//       } else {
//         console.error("Login failed:", result?.error);
//         // Sử dụng form.setError thay vì alert
//         toast.error("Invalid email or password");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error("An error occurred during login");
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       setIsGoogleLoading(true);

//       // Redirect trực tiếp tới backend Google OAuth
//       // Backend sẽ set cookies và redirect về /api/google-callback
//       const googleOAuthUrl = `http://localhost:8080/api/auth/login/google`;
//       window.location.href = googleOAuthUrl;
//     } catch (error) {
//       console.error("Google login error:", error);
//       setIsGoogleLoading(false);
//     }
//   };

//   const handleResendVerification = async () => {
//     if (!resendEmail.trim()) {
//       setResendStatus("error");
//       setResendMessage("Please enter your email address");
//       return;
//     }

//     try {
//       setResendStatus("loading");

//       const response = await fetch(
//         "http://localhost:8080/api/auth/resend-verification",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email: resendEmail }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         setResendStatus("success");
//         setResendMessage(
//           "Verification email sent successfully! Please check your inbox."
//         );
//       } else {
//         setResendStatus("error");
//         setResendMessage(data.message || "Failed to send verification email");
//       }
//     } catch (error) {
//       console.error("Resend verification error:", error);
//       setResendStatus("error");
//       setResendMessage("An error occurred. Please try again.");
//     }
//   };

//   const resetResendModal = () => {
//     setShowResendModal(false);
//     setResendEmail("");
//     setResendStatus("idle");
//     setResendMessage("");
//   };

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
//         {/* Header */}
//         <div className="text-center mb-6 sm:mb-8">
//           <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-white text-xl sm:text-2xl font-bold">B</span>
//           </div>
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
//             Welcome Back
//           </h2>
//           <p className="text-sm sm:text-base text-gray-500">
//             Sign in to continue to Busify
//           </p>
//         </div>

//         {/* Login Form */}
//         <Form {...form}>
//           <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-gray-700 font-medium">
//                     Email Address
//                   </FormLabel>
//                   <Input
//                     {...field}
//                     type="email"
//                     placeholder="Enter your email"
//                     required
//                     className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
//                   />
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-gray-700 font-medium">
//                     Password
//                   </FormLabel>
//                   <div className="relative">
//                     <Input
//                       {...field}
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter your password"
//                       required
//                       className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPassword ? (
//                         <FaEyeSlash size={18} />
//                       ) : (
//                         <FaEye size={18} />
//                       )}
//                     </button>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Remember me & Forgot password */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-600">Remember me</span>
//               </label>
//               <a
//                 href="#"
//                 className="text-sm text-green-600 hover:text-green-700 font-medium"
//               >
//                 Forgot password?
//               </a>
//             </div>

//             <Button
//               type="submit"
//               disabled={loginLoading}
//               className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
//             >
//               {loginLoading && <Loader2 className="animate-spin" />}
//               Sign In
//             </Button>
//           </form>
//         </Form>
//         <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
//           <button
//             onClick={handleGoogleLogin}
//             disabled={isGoogleLoading}
//             className="flex items-center justify-center py-3 px-2 sm:px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isGoogleLoading ? (
//               <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
//             ) : (
//               <FcGoogle size={20} />
//             )}
//           </button>

//           <button className="flex items-center justify-center py-3 px-2 sm:px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
//             <FaFacebook size={20} className="text-blue-600" />
//           </button>

//           <button className="flex items-center justify-center py-3 px-2 sm:px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
//             <FaGithub size={20} className="text-gray-800" />
//           </button>
//         </div>

//         {/* Sign up link */}
//         <div className="text-center mt-6">
//           <p className="text-sm sm:text-base text-gray-600">
//             Don&apos;t have an account?{" "}
//             <Link
//               href="/signup"
//               className="text-green-600 hover:text-green-700 font-semibold"
//             >
//               Sign up for free
//             </Link>
//           </p>
//           <p className="text-sm text-gray-600 mt-2">
//             Haven&apos;t received verification email?{" "}
//             <button
//               onClick={() => setShowResendModal(true)}
//               className="text-green-600 hover:text-green-700 font-semibold underline"
//             >
//               Resend verification
//             </button>
//           </p>
//         </div>

//         {/* Resend Verification Modal */}
//         {showResendModal && (
//           <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl p-6 w-full max-w-md">
//               <div className="text-center mb-6">
//                 <h3 className="text-xl font-bold text-gray-800 mb-2">
//                   Resend Verification Email
//                 </h3>
//                 <p className="text-gray-600 text-sm">
//                   Enter your email address to receive a new verification link
//                 </p>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <Input
//                     type="email"
//                     placeholder="Enter your email"
//                     value={resendEmail}
//                     onChange={(e) => setResendEmail(e.target.value)}
//                     className="h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>

//                 {resendMessage && (
//                   <div
//                     className={`p-3 rounded-lg text-sm ${
//                       resendStatus === "success"
//                         ? "bg-green-50 text-green-700 border border-green-200"
//                         : "bg-red-50 text-red-700 border border-red-200"
//                     }`}
//                   >
//                     {resendMessage}
//                   </div>
//                 )}

//                 <div className="flex space-x-3">
//                   <Button
//                     onClick={resetResendModal}
//                     variant="outline"
//                     className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={handleResendVerification}
//                     disabled={resendStatus === "loading"}
//                     className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
//                   >
//                     {resendStatus === "loading" ? (
//                       <div className="flex items-center justify-center">
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Sending...
//                       </div>
//                     ) : (
//                       "Send Email"
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginForm;
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
import { Loader2 } from "lucide-react";
import { BASE_URL } from "@/lib/constants/constants"; // Đảm bảo import đúng đường dẫn

const LoginForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [showResendModal, setShowResendModal] = React.useState(false);
  const [loginLoading, setLoginLoading] = React.useState(false);
  const [resendEmail, setResendEmail] = React.useState("");
  const [resendStatus, setResendStatus] =
    React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [resendMessage, setResendMessage] = React.useState("");

  const router = useRouter();
  const formSchema = z.object({
    email: z.email("Invalid email address").min(2).max(50),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100),
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
    setLoginLoading(true);
    e.preventDefault();

    try {
      // Gọi API login trực tiếp
      const response = await fetch(`${BASE_URL}api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.getValues("email"),
          password: form.getValues("password"),
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok && data.result) {
        
        if (typeof window !== "undefined") {
          // localStorage.setItem("accessToken", data.result.accessToken);
          localStorage.setItem("email", data.result.email);
          localStorage.setItem("fullName",data.result.fullName);
          localStorage.setItem("phoneNumber",data.result.phoneNumber);
        }

        // Sử dụng signIn để thiết lập session với next-auth
        const signInResult = await signIn("credentials", {
          redirect: false,
          username: form.getValues("email"),
          password: form.getValues("password"),
          // accessToken: data.result.accessToken, // Truyền accessToken để next-auth sử dụng
          email: data.result.email,
          fullName: data.result.fullName,
          phoneNumber: data.result.phoneNumber
        });

        if (signInResult?.ok && !signInResult?.error) {
          console.log("Login successful, redirecting...");
          router.push("/");
        } else {
          console.error("Session setup failed:", signInResult?.error);
          toast.error("Failed to set up session");
        }
      } else {
        console.error("Login failed:", data.message);
        toast.error(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);

      // Redirect trực tiếp tới backend Google OAuth
      const googleOAuthUrl = `http://localhost:8080/api/auth/login/google`;
      window.location.href = googleOAuthUrl;
    } catch (error) {
      console.error("Google login error:", error);
      setIsGoogleLoading(false);
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

      const data = await response.json();

      if (response.ok) {
        setResendStatus("success");
        setResendMessage(
          "Verification email sent successfully! Please check your inbox."
        );
      } else {
        setResendStatus("error");
        setResendMessage(data.message || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      setResendStatus("error");
      setResendMessage("An error occurred. Please try again.");
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
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Sign in to continue to Busify
          </p>
        </div>

        {/* Login Form */}
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Email Address
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Password
                  </FormLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loginLoading}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              {loginLoading && <Loader2 className="animate-spin mr-2" />}
              Sign In
            </Button>
          </form>
        </Form>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="flex items-center justify-center py-3 px-2 sm:px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
            ) : (
              <FcGoogle size={20} />
            )}
          </button>

          <button className="flex items-center justify-center py-3 px-2 sm:px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <FaFacebook size={20} className="text-blue-600" />
          </button>

          <button className="flex items-center justify-center py-3 px-2 sm:px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200">
            <FaGithub size={20} className="text-gray-800" />
          </button>
        </div>

        {/* Sign up link */}
        <div className="text-center mt-6">
          <p className="text-sm sm:text-base text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Sign up for free
            </Link>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Haven&apos;t received verification email?{" "}
            <button
              onClick={() => setShowResendModal(true)}
              className="text-green-600 hover:text-green-700 font-semibold underline"
            >
              Resend verification
            </button>
          </p>
        </div>

        {/* Resend Verification Modal */}
        {showResendModal && (
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Resend Verification Email
                </h3>
                <p className="text-gray-600 text-sm">
                  Enter your email address to receive a new verification link
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
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
                    onClick={resetResendModal}
                    variant="outline"
                    className="flex-1 h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleResendVerification}
                    disabled={resendStatus === "loading"}
                    className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    {resendStatus === "loading" ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
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