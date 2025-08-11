"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import { resetPassword } from "@/lib/data/auth";

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<
    "loading" | "form" | "success" | "error" | "expired"
  >("loading");
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [pwCheck, setPwCheck] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const checkPassword = (password: string) => {
    const result = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    setPwCheck(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu không khớp nhau.");
      return;
    }
    if (Object.values(pwCheck).filter(Boolean).length < 3) {
      setMessage("Mật khẩu chưa đủ mạnh.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (!token) {
        setStatus("expired");
        setMessage("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
        setIsSubmitting(false);
        return;
      }
      const response = await resetPassword(token, newPassword);
      if (response.code === 200) {
        setStatus("success");
        setMessage("Đặt lại mật khẩu thành công! Đang chuyển hướng...");
      } else {
        setStatus("error");
        setMessage(response.message || "Không thể đặt lại mật khẩu.");
      }
    } catch {
      setStatus("error");
      setMessage("Có lỗi xảy ra khi đặt lại mật khẩu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Đặt Lại Mật Khẩu
          </h2>
          {message && <p className="text-red-500 text-sm mb-3">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mật Khẩu Mới
              </label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    checkPassword(e.target.value);
                  }}
                  placeholder="Nhập mật khẩu mới"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* Thông báo yêu cầu mật khẩu ngắn gọn */}
              {newPassword && (
                <p className="mt-2 text-xs">
                  {Object.values(pwCheck).filter(Boolean).length >= 3 ? (
                    <span className="text-green-600">Mật khẩu đủ mạnh</span>
                  ) : (
                    <span className="text-red-500">
                      Cần:{" "}
                      {[
                        !pwCheck.length && "6+ ký tự",
                        !pwCheck.uppercase && "chữ hoa",
                        !pwCheck.lowercase && "chữ thường",
                        !pwCheck.number && "số",
                        !pwCheck.special && "ký tự đặc biệt",
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Xác Nhận Mật Khẩu
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Xác nhận mật khẩu"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {confirmPassword && (
                <p
                  className={`text-xs mt-1 ${
                    newPassword === confirmPassword
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {newPassword === confirmPassword
                    ? "Mật khẩu khớp nhau"
                    : "Mật khẩu không khớp"}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || newPassword !== confirmPassword}
              className="w-full h-12"
            >
              {isSubmitting ? "Đang xử lý..." : "Đặt Lại Mật Khẩu"}
            </Button>
          </form>
        </>

        {status === "success" && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FaCheck className="text-green-600 text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-green-700">Thành công!</h2>
            <p>{message}</p>
            <p className="text-sm text-gray-500">
              Chuyển hướng trong {countdown} giây...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-red-600">Thất bại</h2>
            <p>{message}</p>
            <Button onClick={() => router.push("/login")} className="mt-4">
              Quay lại đăng nhập
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
