"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  applyDiscountClient,
  DiscountInfo,
  calculateDiscountAmount,
  MIN_BOOKING_AMOUNT,
} from "@/lib/data/discount";
import { Loader2, X } from "lucide-react";

interface PromoCodeSectionProps {
  initialDiscount: number;
  onDiscountChange: (
    newDiscount: number,
    discountInfo: DiscountInfo | null
  ) => void;
  originalPrice: number;
}

export default function PromoCodeSection({
  initialDiscount,
  onDiscountChange,
  originalPrice,
}: PromoCodeSectionProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(initialDiscount);
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyPromoCode = useCallback(async () => {
    if (!promoCode.trim()) {
      setError("Vui lòng nhập mã giảm giá");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await applyDiscountClient(promoCode.trim());

      if (response.success && response.discount) {
        const discountAmount = calculateDiscountAmount(
          originalPrice,
          response.discount
        );
        const finalDiscountAmount = Math.min(discountAmount, originalPrice);

        // Kiểm tra điều kiện: giá sau khi giảm phải >= 50,000 VND
        const finalPrice = originalPrice - finalDiscountAmount;

        if (finalPrice < MIN_BOOKING_AMOUNT) {
          throw new Error(
            `Mã giảm giá này không thể áp dụng cho booking này vì giá trị quá lớn. Giá sau khi giảm phải tối thiểu ${MIN_BOOKING_AMOUNT.toLocaleString(
              "vi-VN"
            )} VND.`
          );
        }

        setDiscount(finalDiscountAmount);
        setDiscountInfo(response.discount);
        onDiscountChange(finalDiscountAmount, response.discount);
        setError(null);
      } else {
        throw new Error("Mã giảm giá không hợp lệ");
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Mã giảm giá không tồn tại hoặc đã hết hạn";
      setError(errorMessage);
      setDiscount(0);
      setDiscountInfo(null);
      onDiscountChange(0, null);
    } finally {
      setIsLoading(false);
    }
  }, [promoCode, originalPrice, onDiscountChange]);

  const handleRemovePromoCode = useCallback(() => {
    setPromoCode("");
    setDiscount(0);
    setDiscountInfo(null);
    setError(null);
    onDiscountChange(0, null);
  }, [onDiscountChange]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleApplyPromoCode();
      }
    },
    [handleApplyPromoCode]
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Nhập mã giảm giá"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          className="w-full"
          disabled={isLoading}
        />
        <Button
          variant="outline"
          onClick={handleApplyPromoCode}
          className="w-auto"
          disabled={isLoading || !promoCode.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang kiểm tra...
            </>
          ) : (
            "Áp dụng"
          )}
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {discountInfo && discount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-green-700 font-medium text-sm">
                ✓ Đã áp dụng mã &quot;{discountInfo.code}&quot;
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemovePromoCode}
              className="text-green-700 hover:text-green-800 hover:bg-green-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
