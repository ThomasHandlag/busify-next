"use client";

import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "Đã xảy ra lỗi không xác định.";

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Lỗi</h1>
        <p className="mt-4">{message}</p>
        <a href="/" className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded">
          Quay lại trang chủ
        </a>
      </div>
    </div>
  );
}