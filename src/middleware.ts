import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl;

    // Kiểm tra nếu có Google OAuth cookies nhưng chưa có NextAuth session
    const accessToken = request.cookies.get("accessToken")?.value;
    const nextAuthToken =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    // Protect /trips/auth/** routes - require authentication
    if (pathname.startsWith("/trips/auth/")) {
      if (!request.nextauth.token) {
        console.log("Unauthorized access to protected route, redirecting to login");
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    // Nếu có accessToken từ Google OAuth nhưng chưa có NextAuth session
    if (accessToken && !nextAuthToken && pathname !== "/auth/google-auto-login") {
      console.log("Redirecting to auto-login");
      return NextResponse.redirect(
        new URL("/auth/google-auto-login", request.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => {
        // Always return true to let the middleware function handle the logic
        // This prevents conflicts between the callback and middleware function
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/trips/auth/(.*)"],
};