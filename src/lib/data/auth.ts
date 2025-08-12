import api from "./axios-instance";
import ResponseError from "./response_error";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions, Session } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { BASE_URL } from "@/lib/constants/constants";

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

/**
 * Thêm Authorized JavaScript origins trong Google Cloud Console
 * For production: https://{YOUR_DOMAIN}
 * For development: http://localhost:3000
 * và Authorized redirect URIs trong Google Cloud Console
 * For production: https://{YOUR_DOMAIN}/api/auth/callback/google
 * For development: http://localhost:3000/api/auth/callback/google
 */
interface UserType {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  role?: string;
}

export const config: NextAuthOptions = {
  debug: true,
  pages: {
    signIn: "/login", //Dẫn đến trang login custom
    // error: "/auth/error", // Custom error page
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      // clientId: process.env.GOOGLE_CLIENT_ID as string,
      // clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      clientId:
        "1048195747015-mf73fonbfa82re2s680jdbhgmkd930dh.apps.googleusercontent.com",
      clientSecret: "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",
    }),
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        username: {
          label: "Username",
          type: "email",
          placeholder: "email ",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        const payload = {
          username: credentials.username,
          password: credentials.password,
        };

        const res = await fetch(`${BASE_URL}api/auth/login`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const tokens = await res.json();

        if (!res.ok) {
          throw new Error("UnAuthorized");
        }
        if (tokens) {
          // Return user object with accessToken and refreshToken
          return {
            id: tokens.result.id,
            name: tokens.result.name,
            email: tokens.result.email,
            avatar: tokens.result.avatar,
            accessToken: tokens.result.accessToken,
            refreshToken: tokens.result.refreshToken,
          } as UserType;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    //cấu hình signIn để xử lý sau khi login với provider thành công
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Gọi API để verify/create user
          const response = await fetch(`${BASE_URL}api/auth/google-signin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
            }),
          });

          if (!response.ok) {
            console.error("Failed to verify/create user with backend");
            return false;
          }

          const data = await response.json();

          console.log(data);
          // Thêm thông tin từ backend vào user object
          user.role = data.result.role;
          user.accessToken = data.result.accessToken;
          user.refreshToken = data.result.refreshToken;

          return true;
        } catch (error) {
          console.error("Error during backend verification:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      // Create a user object with token properties
      const userObject: UserType = {
        id: (token.id as string) || "",
        name: (token.name as string) ?? "",
        accessToken: (token.accessToken as string) ?? "",
        refreshToken: (token.refreshToken as string) ?? "",
        email: (token.email as string) ?? "",
        role: (token.role as string) ?? "",
      };

      // Add the user object to the session
      session.user = userObject;
      return session;
    },
  },
};

declare module "next-auth" {
  interface User extends UserType {
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: UserType & {
      accessToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends UserType {
    accessToken?: string;
    refreshToken?: string;
  }
}

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
