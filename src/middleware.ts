import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    // Handle language preference from cookie
    const locale = request.cookies.get("locale")?.value || "en";
    
    // You can add locale-specific logic here if needed
    // For example, redirect to localized paths or set headers
    
    // Redirect if user is authenticated
    if (request.nextauth.token && request.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (!request.nextauth.token && request.nextUrl.pathname.includes("/user")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Add locale to response headers for debugging
    const response = NextResponse.next();
    response.headers.set("x-locale", locale);
    
    return response;
  },
  {
    callbacks: {
      authorized: () => {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/user/(.*)"],
};
