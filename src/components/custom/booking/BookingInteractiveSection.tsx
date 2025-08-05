"use client";

import { useState } from "react";
import PromoCodeSection from "./PromoCodeSection";
import PaymentMethods from "./PaymentMethods";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingData {
  trip: { route: string };
  selectedSeats: string[];
  pricing: { totalPrice: number };
}

interface BookingInteractiveSectionProps {
  initialTotalPrice: number;
  mockData: BookingData;
}

export default function BookingInteractiveSection({
  initialTotalPrice,
  mockData,
}: BookingInteractiveSectionProps) {
  const [discount, setDiscount] = useState(0);
  const finalAmount = initialTotalPrice - discount;

  // Tách riêng loại thanh toán và phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState<string>("momo");

  // Số tiền cần thanh toán dựa vào loại thanh toán
  

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
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          >
            Xác nhận và thanh toán  •
            <span className="ml-2">
              {initialTotalPrice.toLocaleString("vi-VN")}đ
            </span>
          </Button>
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
