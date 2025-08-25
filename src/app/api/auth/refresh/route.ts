import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/lib/constants/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token is required" },
        { status: 400 }
      );
    }

    // Gọi API backend để refresh token
    const response = await fetch(`${BASE_URL}api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Nếu refresh token không hợp lệ hoặc đã hết hạn
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    const data = await response.json();

    // Trả về access token và refresh token mới
    return NextResponse.json({
      success: true,
      accessToken: data.result.accessToken,
      refreshToken: data.result.refreshToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
