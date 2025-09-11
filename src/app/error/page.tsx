"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "Đã xảy ra lỗi không mong muốn";

  const getErrorMessage = (errorType: string) => {
    switch (errorType) {
      case "Payment failed":
        return {
          title: "Thanh toán thất bại",
          description: "Giao dịch của bạn không thể hoàn tất. Vui lòng thử lại.",
          icon: "payment"
        };
      case "Payment verification failed":
        return {
          title: "Xác thực thanh toán thất bại", 
          description: "Không thể xác thực kết quả thanh toán. Vui lòng liên hệ hỗ trợ.",
          icon: "verification"
        };
      case "Invalid payment callback":
        return {
          title: "Thông tin thanh toán không hợp lệ",
          description: "Dữ liệu trả về từ cổng thanh toán không đúng định dạng.",
          icon: "invalid"
        };
      case "Missing payment information":
        return {
          title: "Thiếu thông tin thanh toán",
          description: "Không tìm thấy thông tin giao dịch. Vui lòng thử lại.",
          icon: "missing"
        };
      default:
        return {
          title: "Có lỗi xảy ra",
          description: message,
          icon: "general"
        };
    }
  };

  const errorInfo = getErrorMessage(message);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full p-4">
      <Card className="max-w-md w-full border-red-200 bg-red-50">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-red-800">
            {errorInfo.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <p className="text-red-700 text-sm leading-relaxed">
            {errorInfo.description}
          </p>
          
          {message === "Payment failed" && (
            <div className="bg-red-100 border border-red-200 rounded-lg p-4 text-left">
              <p className="text-red-800 text-sm font-medium mb-2">Có thể do:</p>
              <ul className="text-red-700 text-sm space-y-1 list-disc list-inside">
                <li>Tài khoản không đủ số dư</li>
                <li>Thông tin thẻ không chính xác</li>
                <li>Ngân hàng từ chối giao dịch</li>
                <li>Phiên giao dịch đã hết hạn</li>
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/trips" className="flex-1">
              <Button 
                variant="outline" 
                className="w-full border-red-300 text-red-700 hover:bg-red-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>
            </Link>
            
            <Button 
              onClick={() => window.history.back()} 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-red-200">
            <p className="text-red-600 text-xs">
              Cần hỗ trợ? Liên hệ:{" "}
              <span className="font-semibold">1900 1234</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
