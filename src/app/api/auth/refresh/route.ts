import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/constants/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 }
      );
    }

    console.log("Calling backend refresh token API...");

    // Gọi API backend để refresh token
    const response = await fetch(`${BASE_URL}api/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token }),
    });

    const data = await response.json();
    console.log("Backend response:", data);

    if (!response.ok || data.code !== 200) {
      // Nếu refresh token không hợp lệ hoặc đã hết hạn
      console.error("Backend refresh failed:", data);
      return NextResponse.json(
        {
          error: data.message || "Invalid or expired refresh token",
          code: data.code,
        },
        { status: response.status }
      );
    }

    // Trả về theo format mà NextAuth expects
    return NextResponse.json({
      code: 200,
      message: data.message,
      result: {
        access_token: data.result.access_token,
        refresh_token: data.result.refresh_token,
      },
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
