import api from "./axios-instance";
import ResponseError from "./response_error";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "@/lib/constants/constants";

// Type definitions để tránh lỗi TypeScript
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    accessToken: string;
    user: {
      email: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    role: string;
    email: string;
  }
}

interface JwtPayload {
  exp: number;
  iat?: number;
  sub?: string;
}
interface RegisterFormData {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}
export const register = async (
  data: RegisterFormData
): Promise<ResponseError> => {
  try {
    const response = await api.post("api/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<ResponseError> => {
  try {
    const response = await api.post("api/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Error during password reset:", error);
    throw error;
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ResponseError> => {
  try {
    const response = await api.post("api/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error during password reset:", error);
    throw error;
  }
};

export const verification = async (token: string): Promise<ResponseError> => {
  try {
    const response = await api.get("api/auth/verify-email", {
      params: { token },
    });
    return response.data;
  } catch (error) {
    console.error("Error during email verification:", error);
    throw error;
  }
};

export const config = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          // Kiểm tra xem có phải Google OAuth không (có accessToken được pass từ frontend)
          if (
            credentials?.accessToken &&
            credentials?.accessToken !== "google_oauth"
          ) {
            // Đây là Google OAuth login với token trực tiếp
            console.log("Google OAuth login detected with direct token");

            return {
              id: credentials.username || "google_user",
              email: credentials.username || "google_user@gmail.com",
              role: "CUSTOMER", // Default role cho Google user
              accessToken: credentials.accessToken,
              refreshToken: credentials.refreshToken || "",
            };
          }

          // Login thường qua username/password
          const response = await fetch(`${BASE_URL}api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials?.username ?? "",
              password: credentials?.password ?? "",
            }),
          });

          const data = await response.json();

          if (response.ok && data.result) {
            // Trả về user object nếu login thành công
            console.log("Login successful, returning user data");
            return {
              id: data.result.email, // Sử dụng email làm id vì API không trả về id
              email: data.result.email,
              role: data.result.role,
              accessToken: data.result.accessToken,
              refreshToken: data.result.refreshToken,
            };
          }

          console.log("Login failed - response not ok or no result");
          return null; // Login thất bại
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, session }) {
      const now = Math.floor(Date.now() / 1000);
      console.log("Token:", token);
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Session:", session);

      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;

        const decode = jwtDecode<JwtPayload>(token.accessToken) as JwtPayload;
        token.accessTokenExpires = decode.exp;
      }

      // Nếu token đã hết hạn, refresh
      if (token.accessTokenExpires && now > token.accessTokenExpires) {
        try {
          const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          });

          const refreshed = await response.json();

          if (!response.ok) throw new Error("Refresh failed");

          token.accessToken = refreshed.accessToken;
          token.accessTokenExpires = now + 60 * 15;
          token.refreshToken = refreshed.refreshToken ?? token.refreshToken; // nếu có refresh mới
        } catch (err) {
          console.error("Refresh token error", err);
          // Trả về token hiện tại thay vì object rỗng
          return token;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login", // Trang login custom của bạn
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
