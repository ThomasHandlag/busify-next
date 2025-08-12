// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { jwtDecode } from "jwt-decode";
// import { BASE_URL } from "@/lib/constants/constants";

// // Type definitions để tránh lỗi TypeScript
// declare module "next-auth" {
//   interface User {
//     id: string;
//     email: string;
//     role: string;
//     accessToken: string;
//     refreshToken: string;
//   }

//   interface Session {
//     accessToken: string;
//     user: {
//       email: string;
//       role: string;
//     };
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     accessToken: string;
//     refreshToken: string;
//     accessTokenExpires: number;
//     role: string;
//     email: string;
//   }
// }

// interface JwtPayload {
//   exp: number;
//   iat?: number;
//   sub?: string;
// }

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         username: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//         accessToken: { label: "Access Token", type: "text" },
//         refreshToken: { label: "Refresh Token", type: "text" },
//       },
//       async authorize(credentials) {
//         try {
//           console.log("Credentials:", credentials);

//           // Kiểm tra xem có phải Google OAuth không (có accessToken được pass từ frontend)
//           if (
//             credentials?.accessToken &&
//             credentials?.accessToken !== "google_oauth"
//           ) {
//             // Đây là Google OAuth login với token trực tiếp
//             console.log("Google OAuth login detected with direct token");

//             return {
//               id: credentials.username || "google_user",
//               email: credentials.username || "google_user@gmail.com",
//               role: "CUSTOMER", // Default role cho Google user
//               accessToken: credentials.accessToken,
//               refreshToken: credentials.refreshToken || "",
//             };
//           }

//           // Login thường qua username/password
//           const response = await fetch(`${BASE_URL}api/auth/login`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               username: credentials?.username ?? "",
//               password: credentials?.password ?? "",
//             }),
//           });

//           const data = await response.json();
//           console.log("API Response:", data);

//           if (response.ok && data.result) {
//             // Trả về user object nếu login thành công
//             console.log("Login successful, returning user data");
//             return {
//               id: data.result.email, // Sử dụng email làm id vì API không trả về id
//               email: data.result.email,
//               role: data.result.role,
//               accessToken: data.result.accessToken,
//               refreshToken: data.result.refreshToken,
//             };
//           }

//           console.log("Login failed - response not ok or no result");
//           return null; // Login thất bại
//         } catch (error) {
//           console.error("Login error:", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       const now = Math.floor(Date.now() / 1000);

//       if (user) {
//         token.accessToken = user.accessToken;
//         token.refreshToken = user.refreshToken;
//         token.id = user.id;
//         token.role = user.role;
//         token.email = user.email;

//         const decode = jwtDecode<JwtPayload>(token.accessToken) as JwtPayload;
//         console.log("Decoded JWT:", decode);
//         token.accessTokenExpires = decode.exp;
//       }

//       // Nếu token đã hết hạn, refresh
//       if (token.accessTokenExpires && now > token.accessTokenExpires) {
//         try {
//           const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ refreshToken: token.refreshToken }),
//           });

//           const refreshed = await response.json();

//           if (!response.ok) throw new Error("Refresh failed");

//           token.accessToken = refreshed.accessToken;
//           token.accessTokenExpires = now + 60 * 15;
//           token.refreshToken = refreshed.refreshToken ?? token.refreshToken; // nếu có refresh mới
//         } catch (err) {
//           console.error("Refresh token error", err);
//           // Trả về token hiện tại thay vì object rỗng
//           return token;
//         }
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken;
//       session.user.email = token.email;
//       session.user.role = token.role;
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/login", // Trang login custom của bạn
//   },
//   session: {
//     strategy: "jwt",
//   },
// });

// export { handler as GET, handler as POST };


import NextAuth from "next-auth";
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

const handler = NextAuth({
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
          console.log("Credentials:", credentials);

          // Kiểm tra xem có phải Google OAuth không
          if (
            credentials?.accessToken &&
            credentials?.accessToken !== "google_oauth"
          ) {
            console.log("Google OAuth login detected with direct token");

            return {
              id: credentials.username || "google_user",
              email: credentials.username || "google_user@gmail.com",
              role: "CUSTOMER",
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
          console.log("API Response:", data);

          if (response.ok && data.result) {
            if (typeof window !== "undefined") {
              // localStorage.setItem("accessToken", data.result.accessToken);
              localStorage.setItem("email", data.result.email);
             localStorage.setItem("fullName", data.result.fullName);

             localStorage.setItem("phoneNumber", data.result.phoneNumber);

            }

            // Trả về user object nếu login thành công
            return {
              id: data.result.email,
              email: data.result.email,
              phoneNumber: data.result.phoneNumber,
              fullName: data.result.fullName,
              role: data.result.role,
              accessToken: data.result.accessToken,
              refreshToken: data.result.refreshToken,
            };
          }

          console.log("Login failed - response not ok or no result");
          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const now = Math.floor(Date.now() / 1000);

      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;

        const decode = jwtDecode<JwtPayload>(token.accessToken);
        console.log("Decoded JWT:", decode);
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
          token.refreshToken = refreshed.refreshToken ?? token.refreshToken;

          // Cập nhật accessToken mới vào localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", refreshed.accessToken);
          }
        } catch (err) {
          console.error("Refresh token error", err);
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
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };