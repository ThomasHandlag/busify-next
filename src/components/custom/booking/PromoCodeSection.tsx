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
import { Loader2, X, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(initialDiscount);
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyPromoCode = useCallback(async () => {
    if (!promoCode.trim()) {
      setError(t("Discount.enterCode"));
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
            t("Discount.cannotApplyMin", {
              min: MIN_BOOKING_AMOUNT?.toLocaleString(),
            })
          );
        }

        setDiscount(finalDiscountAmount);
        setDiscountInfo(response.discount);
        onDiscountChange(finalDiscountAmount, response.discount);
        setError(null);
      } else {
        throw new Error(t("Discount.invalidCode"));
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("Discount.notFoundOrExpired");
      setError(errorMessage);
      setDiscount(0);
      setDiscountInfo(null);
      onDiscountChange(0, null);
    } finally {
      setIsLoading(false);
    }
  }, [promoCode, originalPrice, onDiscountChange, t]);

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
    <div className="space-y-4">
      {/* Promo Code Input */}
      <div className="relative">
        <div className="relative flex gap-3">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={t("Discount.enterCode")}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              onKeyUp={handleKeyPress}
              className={`pl-11 pr-4 py-3 text-sm border-2 transition-all duration-300 ${
                error
                  ? "border-red-300 focus:border-red-500 bg-red-50"
                  : discountInfo
                  ? "border-green-300 bg-green-50"
                  : "border-muted"
              }`}
              disabled={isLoading}
            />
          </div>
          <Button
            aria-label="Apply Promo Code"
            onClick={handleApplyPromoCode}
            className={`px-6 py-3 font-semibold transition-all duration-300`}
            disabled={isLoading || !promoCode.trim()}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t("Discount.checking")}</span>
              </div>
            ) : discountInfo ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t("Discount.appliedButton")}</span>
              </div>
            ) : (
              t("Discount.apply")
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-red-700 font-medium text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {discountInfo && discount > 0 && (
        <div className="bg-primary/20 border-2 border-primary rounded-xl p-4 animate-fade-in relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-foreground font-bold text-sm">
                  🎉 {t("Discount.applied", { code: discountInfo.code })}
                </p>
                <p className="text-foreground text-xs mt-1">
                  {t("Discount.saveForOrder", {
                    amount: discount?.toLocaleString("vi-VN") + "đ",
                  })}
                </p>
              </div>
            </div>
            <Button
              aria-label="Remove Promo Code"
              variant="ghost"
              size="sm"
              onClick={handleRemovePromoCode}
              className="rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
