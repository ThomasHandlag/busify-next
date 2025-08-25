import { getSession, signOut } from "next-auth/react";
import api from "../data/axios-instance";

interface RefreshTokenResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
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
      const response = await api.post("/api/auth/refresh", {
        refreshToken,
      });

      if (response.status !== 200) {
        throw new Error("Failed to refresh token");
      }

      const data: RefreshTokenResponse = response.data;

      if (data.success && data.accessToken) {
        return data.accessToken;
      }

      throw new Error(data.error || "Failed to refresh token");
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
      return await this.refreshPromise;
    }

    const session = await getSession();

    if (!session?.user?.accessToken) {
      return null;
    }

    // Nếu token còn hợp lệ, trả về luôn
    if (!this.isTokenExpired(session.user.accessToken)) {
      return session.user.accessToken;
    }

    // Nếu không có refresh token, logout
    if (!session.user.refreshToken) {
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
        // Cập nhật session với token mới
        // Note: Trong thực tế, bạn có thể cần trigger một update session
        console.log("Token refreshed successfully");
        return newAccessToken;
      }

      // Nếu refresh thất bại, logout
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
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    });
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
