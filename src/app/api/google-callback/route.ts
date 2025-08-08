import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    // Lấy cookies từ request (được set bởi backend)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    console.log("Google callback - Access Token:", accessToken);
    console.log("Google callback - Refresh Token:", refreshToken);

    if (!accessToken) {
      console.error("No access token found in cookies");
      return NextResponse.redirect(
        new URL("/login?error=no_token", request.url)
      );
    }

    // Decode JWT để lấy thông tin user (nếu cần)
    let userEmail = "google_user@gmail.com";
    try {
      // Có thể decode JWT để lấy email thực
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      userEmail = payload.email || payload.sub || userEmail;
    } catch {
      console.log("Could not decode JWT, using default email");
    }

    // Redirect về trang chứa script để trigger NextAuth
    const callbackUrl = new URL("/google-login-handler", request.url);
    callbackUrl.searchParams.set("access_token", accessToken);
    callbackUrl.searchParams.set("refresh_token", refreshToken || "");
    callbackUrl.searchParams.set("email", userEmail);

    return NextResponse.redirect(callbackUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=callback_failed", request.url)
    );
  }
}
