import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
const middleware = async (request: NextRequest) => {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl.clone();

  if (!token) {
    if (url.pathname.startsWith("/admin")) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } else {
    if (url.pathname === "/login") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
};

export default middleware;