import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Kiểm tra nếu có Google OAuth cookies nhưng chưa có NextAuth session
  const accessToken = request.cookies.get("accessToken")?.value;
  const nextAuthToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  console.log("Middleware - Access Token:", !!accessToken);
  console.log("Middleware - NextAuth Token:", !!nextAuthToken);
  console.log("Middleware - Current Path:", request.nextUrl.pathname);

  // Nếu có accessToken từ Google OAuth nhưng chưa có NextAuth session
  if (accessToken && !nextAuthToken) {
    // Chỉ redirect nếu không phải đang ở trang auto-login
    if (request.nextUrl.pathname !== "/auth/google-auto-login") {
      console.log("Redirecting to auto-login");
      return NextResponse.redirect(
        new URL("/auth/google-auto-login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
