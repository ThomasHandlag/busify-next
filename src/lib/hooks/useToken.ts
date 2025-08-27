import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import TokenManager from "../utils/token-manager";

export interface UseTokenResult {
  accessToken: string | null;
  isLoading: boolean;
  isTokenValid: boolean;
  refreshToken: () => Promise<void>;
  error: string | null;
}

/**
 * Hook để quản lý access token với auto-refresh
 */
export const useToken = (): UseTokenResult => {
  const { data: session, update } = useSession();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kiểm tra token có hợp lệ không
  const isTokenValid = useCallback(() => {
    if (!accessToken) return false;
    return !TokenManager.isTokenExpired(accessToken);
  }, [accessToken]);

  // Refresh token manually
  const refreshToken = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newToken = await TokenManager.getValidAccessToken();
      if (newToken) {
        setAccessToken(newToken);
        // Trigger session update để sync với NextAuth
        await update();
      } else {
        setError("Failed to refresh token");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [update]);

  // Khởi tạo và theo dõi session
  useEffect(() => {
    if (session?.user?.accessToken) {
      setAccessToken(session.user.accessToken);
    } else {
      setAccessToken(null);
    }
  }, [session]);

  // Auto refresh khi token sắp hết hạn
  useEffect(() => {
    if (!accessToken) return;

    const checkAndRefreshToken = async () => {
      if (TokenManager.isTokenExpired(accessToken)) {
        console.log("Token expired, auto-refreshing...");
        await refreshToken();
      }
    };

    // Check mỗi 30 giây
    const interval = setInterval(checkAndRefreshToken, 30 * 1000);

    return () => clearInterval(interval);
  }, [accessToken, refreshToken]);

  return {
    accessToken,
    isLoading,
    isTokenValid: isTokenValid(),
    refreshToken,
    error,
  };
};

/**
 * Hook để tự động thêm Authorization header vào API calls
 */
export const useAuthenticatedFetch = () => {
  const { accessToken } = useToken();

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      return fetch(url, {
        ...options,
        headers,
      });
    },
    [accessToken]
  );

  return authenticatedFetch;
};
