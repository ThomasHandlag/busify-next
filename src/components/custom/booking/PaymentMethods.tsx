"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";

export default function PaymentMethods({
  paymentMethod,
  onPaymentMethodChange,
}: {
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;

  mockData: {
    trip: { route: string };
    selectedSeats: string[];
  };
}) {
  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Phương thức thanh toán</Label>
      <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange}>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="momo" id="momo" />
            <Label
              htmlFor="momo"
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-6 h-6 rounded flex items-center justify-center relative">
                <Image
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Circle.png"
                  alt="MoMo Logo"
                  fill
                  className="w-4 h-4"
                />
              </div>
              <span className="text-sm font-medium">MoMo</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="zalopay" id="zalopay" />
            <Label
              htmlFor="zalopay"
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-6 h-6 rounded flex items-center justify-center relative">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwPynD27LbXlPsbofv1AX-5ZXDn_XMGo-1TA&s"
                  fill
                  alt="ZaloPay"
                  className="w-4 h-4"
                />
              </div>
              <span className="text-sm font-medium">ZaloPay</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="viettelmoney" id="viettelmoney" />
            <Label
              htmlFor="viettelmoney"
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-6 h-6 rounded flex items-center justify-center relative">
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg4HNMFnJLLavO19NsgZZucD9GEVqPG-uG4Q&s"
                  alt="ViettelMoney"
                  fill
                  className="w-4 h-4"
                />
              </div>
              <span className="text-sm font-medium">ViettelMoney</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="vnpay" id="vnpay" />
            <Label
              htmlFor="vnpay"
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-6 h-6 rounded flex items-center justify-center relative">
                <Image
                  src="https://cdn-new.topcv.vn/unsafe/150x/https://static.topcv.vn/company_logos/cong-ty-cp-giai-phap-thanh-toan-viet-nam-vnpay-6194ba1fa3d66.jpg"
                  alt="VNPAY"
                  className="w-4 h-4"
                  fill
                />
              </div>
              <span className="text-sm font-medium">VNPay</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="shopeepay" id="shopeepay" />
            <Label
              htmlFor="shopeepay"
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-6 h-6 rounded flex items-center justify-center relative">
                <Image
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ShopeePay-V.png"
                  alt="SPAY"
                  fill
                  className="w-4 h-4"
                />
              </div>
              <span className="text-sm font-medium">ShopeePay</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="vietcombank" id="vietcombank" />
            <Label
              htmlFor="vietcombank"
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-6 h-6 rounded flex items-center justify-center relative">
                <Image
                  fill
                  src="https://hienlaptop.com/wp-content/uploads/2024/12/logo-vietcombank-vector-13.png"
                  alt="VCB"
                  className="w-4 h-4"
                />
              </div>
              <span className="text-sm font-medium">Vietcombank</span>
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
