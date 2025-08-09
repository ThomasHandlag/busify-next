"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PromoCodeSection({
  initialDiscount,
  onDiscountChange,
}: {
  initialDiscount: number
  onDiscountChange: (newDiscount: number) => void
}) {
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(initialDiscount)

  const handleApplyPromoCode = useCallback(() => {
    if (promoCode === "SAVE10") {
      const newDiscount = 50000
      setDiscount(newDiscount)
      onDiscountChange(newDiscount)
    } else {
      setDiscount(0)
      onDiscountChange(0)
    }
  }, [promoCode, onDiscountChange])

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Nhập mã giảm giá"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        className="w-full"
      />
      <Button variant="outline" onClick={handleApplyPromoCode} className="w-auto">
        Áp dụng
      </Button>
      {discount > 0 && (
        <p className="text-green-600 text-sm mt-2">
          Đã áp dụng mã giảm giá: -{discount.toLocaleString("vi-VN")}đ
        </p>
      )}
    </div>
  )
}