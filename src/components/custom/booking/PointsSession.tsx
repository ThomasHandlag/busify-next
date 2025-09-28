"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  const handleApplyPoints = useCallback(() => {
    const enteredPoints = parseInt(pointsInput, 10);

    if (isNaN(enteredPoints) || enteredPoints <= 0) {
      setError(t("Points.invalid"));
      return;
    }

    if (enteredPoints > availablePoints) {
      setError(
        `${t("Points.amountNotice1")} ${availablePoints} ${t("Points.points")}`
      );
      return;
    }

    const discountFromPoints = enteredPoints * 1000;
    const maxUsable = originalPrice - discountAmount;

    if (discountFromPoints > maxUsable) {
      setError(
        `${t("Points.exceedLimit")} ${Math.floor(maxUsable / 1000)} ${t(
          "Points.points"
        )}`
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
    t,
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
          placeholder={t("Points.enterPoint")}
          value={pointsInput}
          onChange={(e) => setPointsInput(e.target.value.replace(/\D/g, ""))}
          className="w-full"
          disabled={loading}
          type="number"
        />
        <Button
          aria-label="Apply Points"
          onClick={handleApplyPoints}
          disabled={loading || !pointsInput.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("Points.usePoints")}...
            </>
          ) : (
            t("Points.usePoints")
          )}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {t("Points.youve")}{" "}
        <span className="font-semibold">{availablePoints}</span>{" "}
        {t("Points.points")} {t("Points.pointValue")}
      </p>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {usedPoints > 0 && (
        <div className="bg-primary/20 border border-primary/50 rounded-lg p-3 flex items-center justify-between">
          <p className="text-foreground text-sm">
            {t("Points.usedPoints", {
              points: usedPoints,
              amount: (usedPoints * 1000)?.toLocaleString("vi-VN") + "đ",
            })}
          </p>
          <Button
            aria-label="Remove Points"
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
