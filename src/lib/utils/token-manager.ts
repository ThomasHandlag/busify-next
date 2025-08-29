import { getSession, signOut } from "next-auth/react";

interface RefreshTokenResponse {
  code: number;
  message: string;
  result?: {
    access_token: string;
    refresh_token?: string;
  };
  error?: string;
}

export class TokenManager {
  private static isRefreshing = false;
  private static refreshPromise: Promise<string | null> | null = null;

  /**
   * Kiểm tra xem access token có còn hợp lệ không
   */
  static isTokenExpired(token: string): boolean {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      // Nếu token không có exp claim, giả định nó còn hiệu lực
      if (!payload.exp) {
        console.warn("Token không có thông tin hết hạn, giả định còn hiệu lực");
        return false;
      }

      // Kiểm tra nếu token sắp hết hạn (trước 5 phút)
      return payload.exp < currentTime + 300;
    } catch (error) {
      console.error("Error parsing token:", error);
      // Nếu không parse được token, giả định nó hết hạn
      return true;
    }
  }

  /**
   * Refresh access token bằng refresh token
   */
  static async refreshAccessToken(
    refreshToken: string
  ): Promise<string | null> {
    try {
      console.log("Calling refresh token API...");

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      const data: RefreshTokenResponse = await response.json();
      console.log("Refresh API response:", data);

      if (response.ok && data.code === 200 && data.result?.access_token) {
        console.log("Token refreshed successfully via API");
        return data.result.access_token;
      }

      console.error("Failed to refresh token:", data.error || data.message);
      throw new Error(data.error || data.message || "Failed to refresh token");
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  }

  /**
   * Lấy access token hợp lệ (refresh nếu cần)
   */
  static async getValidAccessToken(): Promise<string | null> {
    // Nếu đang trong quá trình refresh, đợi kết quả
    if (this.isRefreshing && this.refreshPromise) {
      console.log("Waiting for ongoing refresh...");
      return await this.refreshPromise;
    }

    const session = await getSession();

    if (!session?.user?.accessToken) {
      console.log("No access token found in session");
      return null;
    }

    // Nếu token còn hợp lệ, trả về luôn
    if (!this.isTokenExpired(session.user.accessToken)) {
      return session.user.accessToken;
    }

    console.log("Access token expired, need to refresh");

    // Nếu không có refresh token, logout
    if (!session.user.refreshToken) {
      console.log("No refresh token available, logging out");
      await this.handleTokenExpired();
      return null;
    }

    // Bắt đầu quá trình refresh
    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh(session.user.refreshToken);

    try {
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Thực hiện refresh token
   */
  private static async performTokenRefresh(
    refreshToken: string
  ): Promise<string | null> {
    try {
      const newAccessToken = await this.refreshAccessToken(refreshToken);

      if (newAccessToken) {
        // Note: NextAuth sẽ tự động cập nhật session thông qua JWT callback
        // khi có request tiếp theo
        console.log("Token refreshed successfully");
        return newAccessToken;
      }

      // Nếu refresh thất bại, logout
      console.log("Token refresh failed, logging out");
      await this.handleTokenExpired();
      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      await this.handleTokenExpired();
      return null;
    }
  }

  /**
   * Force refresh token (không kiểm tra expiry)
   */
  static async forceRefreshToken(): Promise<string | null> {
    const session = await getSession();

    if (!session?.user?.refreshToken) {
      console.error("No refresh token available");
      return null;
    }

    return await this.refreshAccessToken(session.user.refreshToken);
  }

  /**
   * Xử lý khi token hết hạn
   */
  static async handleTokenExpired(): Promise<void> {
    console.log("Token expired, logging out...");

    // Chỉ redirect nếu đang ở client side
    if (typeof window !== "undefined") {
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    }
  }

  /**
   * Xóa toàn bộ token (logout)
   */
  static async clearTokens(): Promise<void> {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  }
}

export default TokenManager;
