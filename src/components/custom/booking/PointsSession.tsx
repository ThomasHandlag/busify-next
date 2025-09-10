"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

interface PointsSectionProps {
  availablePoints: number; // số điểm hiện có (fetch từ API /scores/user/:id)
  onPointsChange: (usedPoints: number, discountAmount: number) => void;
  originalPrice: number;
  discountAmount: number; // số tiền đã giảm từ mã giảm giá
}

export default function PointsSection({
  availablePoints,
  onPointsChange,
  originalPrice,
  discountAmount,
}: PointsSectionProps) {
  const [pointsInput, setPointsInput] = useState("");
  const [usedPoints, setUsedPoints] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleApplyPoints = useCallback(() => {
    const enteredPoints = parseInt(pointsInput, 10);

    if (isNaN(enteredPoints) || enteredPoints <= 0) {
      setError("Vui lòng nhập số điểm hợp lệ");
      return;
    }

    if (enteredPoints > availablePoints) {
      setError(`Bạn chỉ có ${availablePoints} điểm khả dụng`);
      return;
    }

    const discountFromPoints = enteredPoints * 1000;
    const maxUsable = originalPrice - discountAmount;

    if (discountFromPoints > maxUsable) {
      setError(
        `Số điểm vượt quá số tiền cần thanh toán. Bạn chỉ có thể dùng tối đa ${Math.floor(
          maxUsable / 1000
        )} điểm`
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setUsedPoints(enteredPoints);
      onPointsChange(enteredPoints, discountFromPoints);
      setError(null);
      setLoading(false);
    }, 500); // giả lập loading
  }, [
    pointsInput,
    availablePoints,
    originalPrice,
    discountAmount,
    onPointsChange,
  ]);

  const handleRemovePoints = useCallback(() => {
    setPointsInput("");
    setUsedPoints(0);
    onPointsChange(0, 0);
    setError(null);
  }, [onPointsChange]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Nhập số điểm muốn sử dụng"
          value={pointsInput}
          onChange={(e) => setPointsInput(e.target.value.replace(/\D/g, ""))}
          className="w-full"
          disabled={loading}
          type="number"
        />
        <Button
          variant="outline"
          onClick={handleApplyPoints}
          disabled={loading || !pointsInput.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang áp dụng...
            </>
          ) : (
            "Dùng điểm"
          )}
        </Button>
      </div>

      <p className="text-sm text-gray-500">
        Bạn đang có <span className="font-semibold">{availablePoints}</span>{" "}
        điểm khả dụng (1 điểm = 1,000đ)
      </p>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {usedPoints > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <p className="text-blue-700 text-sm">
            ✓ Đã dùng {usedPoints} điểm (-
            {(usedPoints * 1000).toLocaleString("vi-VN")}đ)
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemovePoints}
            className="text-blue-700 hover:text-blue-800 hover:bg-blue-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
