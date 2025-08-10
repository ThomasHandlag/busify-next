

"use client";

import { useState } from "react";
import PromoCodeSection from "./PromoCodeSection";
import PaymentMethods from "./PaymentMethods";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface BookingData {
  trip: { route: string };
  selectedSeats: string[];
  pricing: { totalPrice: number };
  passenger: {
    fullName: string;
    phone: string;
    email: string;
  };
}

interface BookingAddRequestDTO {
  tripId: number;
  customerId?: number | null;
  guestFullName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress?: string | null;
  seatNumber: string;
  totalAmount: number;
}

interface PaymentRequestDTO {
  bookingId: number;
  paymentMethod: string;
}

interface BookingInteractiveSectionProps {
  initialTotalPrice: number;
  mockData: BookingData;
  tripId: string;
}

export default function BookingInteractiveSection({
  initialTotalPrice,
  mockData,
  tripId,
}: BookingInteractiveSectionProps) {
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("vnpay"); // Mặc định là VNPAY
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const router = useRouter();

  const finalAmount = initialTotalPrice - discount;

  // Hàm xử lý xác nhận thanh toán
  const handleConfirmPayment = async () => {
    // Kiểm tra dữ liệu trước khi gửi
    if (!mockData.selectedSeats.length) {
      setPaymentError("Vui lòng chọn ít nhất một ghế.");
      return;
    }
    if (!mockData.passenger.fullName || !mockData.passenger.email || !mockData.passenger.phone) {
      setPaymentError("Thông tin hành khách không đầy đủ.");
      return;
    }
    if (finalAmount <= 0) {
      setPaymentError("Số tiền thanh toán không hợp lệ.");
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);
    setPaymentLink(null);

    try {
      // Bước 1: Gửi POST request tới API bookings
      const bookingRequest: BookingAddRequestDTO = {
        tripId: Number(tripId),
        customerId: null,
        guestFullName: mockData.passenger.fullName,
        guestEmail: mockData.passenger.email,
        guestPhone: mockData.passenger.phone,
        guestAddress: null,
        seatNumber: mockData.selectedSeats.join(","),
        totalAmount: finalAmount,
      };

      console.log("Sending booking request:", bookingRequest);

      const bookingResponse = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingRequest),
      });

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json().catch(() => null);
        const errorMessage = errorData?.message || `Lỗi khi gửi yêu cầu đặt vé: ${bookingResponse.status}`;
        console.error("Booking API error response:", errorData);
        throw new Error(errorMessage);
      }

      const bookingResult = await bookingResponse.json();
      const bookingId = bookingResult.result?.bookingId;
      if (!bookingId) {
        throw new Error("Không nhận được booking_id từ API bookings");
      }
      console.log("Booking created successfully, booking_id:", bookingId);

      // Bước 2: Gửi POST request tới API payments
      const paymentRequest: PaymentRequestDTO = {
        bookingId: bookingId,
        paymentMethod: paymentMethod.toUpperCase(),
      };

      console.log("Sending payment request:", paymentRequest);

      const paymentResponse = await fetch("http://localhost:8080/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json().catch(() => null);
        const errorMessage = errorData?.message || `Lỗi khi tạo thanh toán: ${paymentResponse.status}`;
        console.error("Payment API error response:", errorData);
        throw new Error(errorMessage);
      }

      const paymentResult = await paymentResponse.json();
      const paymentUrl = paymentResult.result?.paymentUrl;
      if (!paymentUrl) {
        throw new Error("Không nhận được link thanh toán từ API payments");
      }
      console.log("Payment link received:", paymentUrl);

      // Lưu link thanh toán để hiển thị
      setPaymentLink(paymentUrl);

      // Không chuyển hướng ngay, để người dùng nhấp vào link thanh toán
      // router.push(`/booking/success/${bookingId}`);
    } catch (error: any) {
      console.error("Lỗi khi xử lý thanh toán:", error.message);
      let userFriendlyMessage = "Không thể xác nhận thanh toán. Vui lòng thử lại.";
      if (error.message.includes("409")) {
        userFriendlyMessage = "Ghế đã được đặt hoặc thông tin không hợp lệ. Vui lòng chọn ghế khác hoặc kiểm tra lại.";
      }
      setPaymentError(userFriendlyMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Mã giảm giá</CardTitle>
        </CardHeader>
        <CardContent>
          <PromoCodeSection
            initialDiscount={discount}
            onDiscountChange={setDiscount}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Tóm tắt thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Giá vé ({mockData.selectedSeats.length} ghế)</span>
              <span>
                {mockData.pricing.totalPrice.toLocaleString("vi-VN")}đ
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá</span>
                <span>-{discount.toLocaleString("vi-VN")}đ</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Tổng tiền</span>
              <span className="text-green-600">
                {finalAmount.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          <PaymentMethods
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            mockData={mockData}
          />

          {paymentError && (
            <p className="text-red-500 text-sm">{paymentError}</p>
          )}

          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            onClick={handleConfirmPayment}
            disabled={paymentLoading || !!paymentLink}
          >
            {paymentLoading ? "Đang xử lý..." : "Xác nhận và thanh toán"} •
            <span className="ml-2">
              {finalAmount.toLocaleString("vi-VN")}đ
            </span>
          </Button>

          {paymentLink && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Nhấn vào link dưới đây để tiến hành thanh toán:
              </p>
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              >
                Thanh toán qua VNPAY
              </a>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1 w-full">
            <p>• Chính sách hủy vé linh hoạt</p>
            <p>• Hỗ trợ 24/7 qua hotline</p>
            <p>• Đảm bảo ghế đã đặt</p>
            <p>• Thanh toán an toàn</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}