"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Gift, Star } from "lucide-react";
import { type Promotion as APIPromotion } from "@/lib/data/promotion";
import { useTranslations } from "next-intl";
import { BASE_URL } from "@/lib/constants/constants";

interface Promotion {
  id: number;
  code: string | null;
  discountType: string;
  promotionType: string;
  discountValue: number;
  minOrderValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  status: string;
  priority: number;
  campaignTitle?: string;
}

interface AutoPromotionSectionProps {
  originalPrice: number;
  onPromotionSelect: (
    promotion: Promotion | null,
    discountAmount: number
  ) => void;
}

export default function AutoPromotionSection({
  originalPrice,
  onPromotionSelect,
}: AutoPromotionSectionProps) {
  const { data: session } = useSession();
  const [autoPromotions, setAutoPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  const t = useTranslations();

  // Function to fetch auto-eligible promotions for the current user
  const fetchAutoEligiblePromotions = useCallback(async (): Promise<
    Promotion[]
  > => {
    try {
      if (!session?.user?.accessToken) {
        console.log("No session or access token found");
        return [];
      }

      console.log(
        "Fetching auto-eligible promotions with token:",
        session.user.accessToken.substring(0, 20) + "..."
      );

      const response = await fetch(
        `${BASE_URL}api/promotions/user/auto-eligible`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      if (data.code === 200 && Array.isArray(data.result)) {
        return data.result.map((promotion: APIPromotion) => ({
          ...promotion,
          campaignTitle: undefined, // API này không trả về campaign title
        }));
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch auto-eligible promotions:", error);
      return [];
    }
  }, [session?.user?.accessToken]);

  useEffect(() => {
    const fetchAutoPromotions = async () => {
      try {
        setLoading(true);

        // Fetch auto-eligible promotions using the new API
        const allAutoPromotions = await fetchAutoEligiblePromotions();

        console.log("Fetched auto-eligible promotions:", allAutoPromotions);

        // Sort by discountValue descending to get best promotion first
        allAutoPromotions.sort((a, b) => {
          const discountA = calculateDiscount(a, originalPrice);
          const discountB = calculateDiscount(b, originalPrice);
          return discountB - discountA;
        });

        // Fetch promotions that user already used to exclude
        let usedIds: number[] = [];
        if (session?.user?.accessToken) {
          try {
            const res = await fetch(`${BASE_URL}api/promotions/user/used`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.user.accessToken}`,
              },
              credentials: "include",
            });
            if (res.ok) {
              const data = await res.json();
              if (data?.code === 200 && Array.isArray(data.result)) {
                usedIds = data.result.map(
                  (item: { promotionId: number }) => item.promotionId
                );
              } else {
                usedIds = [];
              }
            }
          } catch {
            usedIds = [];
          }
        } else {
          usedIds = [];
        }

        console.log("user Ids", usedIds);
        // Exclude used promotions
        const visible = allAutoPromotions.filter(
          (p) => !usedIds.includes(p.id)
        );

        console.log("promotion visible", visible);
        setAutoPromotions(visible);

        // Auto-select the best promotion only once when data loads
        if (visible.length > 0 && !hasAutoSelected) {
          const bestPromotion = visible[0];
          const discountAmount = calculateDiscount(
            bestPromotion,
            originalPrice
          );
          if (discountAmount > 0) {
            setSelectedPromotion(bestPromotion);
            setHasAutoSelected(true);
            onPromotionSelect(bestPromotion, discountAmount);
          }
        }
      } catch (error) {
        console.error("Failed to fetch auto promotions:", error);
        setAutoPromotions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAutoPromotions();
  }, [
    originalPrice,
    onPromotionSelect,
    hasAutoSelected,
    fetchAutoEligiblePromotions,
    session?.user?.accessToken,
  ]); // Include all dependencies

  const calculateDiscount = (promotion: Promotion, price: number): number => {
    if (price < promotion.minOrderValue) {
      return 0;
    }

    if (promotion.discountType === "PERCENTAGE") {
      return Math.floor((price * promotion.discountValue) / 100);
    } else {
      return Math.min(promotion.discountValue, price);
    }
  };

  const handlePromotionSelect = (promotion: Promotion) => {
    if (selectedPromotion?.id === promotion.id) {
      // Deselect if clicking the same promotion
      setSelectedPromotion(null);
      onPromotionSelect(null, 0);
    } else {
      setSelectedPromotion(promotion);
      const discountAmount = calculateDiscount(promotion, originalPrice);
      onPromotionSelect(promotion, discountAmount);
    }
  };

  const formatDiscountValue = (promotion: Promotion): string => {
    if (promotion.discountType === "PERCENTAGE") {
      return `${promotion.discountValue}%`;
    } else {
      return `${promotion.discountValue?.toLocaleString("vi-VN")}đ`;
    }
  };

  const getDiscountDisplay = (promotion: Promotion): string => {
    const discount = calculateDiscount(promotion, originalPrice);
    return discount > 0
      ? `${t("Booking.saveAmount")} ${discount?.toLocaleString("vi-VN")}đ`
      : t("Booking.notEligible");
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gift className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">
              {t("Booking.specialOffersLoading")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-2">
            {[...Array(1)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (autoPromotions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Gift className="w-5 h-5" />
          <span className="font-semibold">🎉 {t("Booking.offers")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {autoPromotions.map((promotion, index) => {
            const isSelected = selectedPromotion?.id === promotion.id;
            const discount = calculateDiscount(promotion, originalPrice);
            const isEligible = discount > 0;
            const isBestDeal = index === 0;

            return (
              <div
                key={promotion.id}
                className={`relative border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-primary/30 bg-primary/5 shadow-md"
                    : isEligible
                    ? "border-border hover:border-primary/50 bg-background hover:shadow-sm"
                    : "border-border bg-muted cursor-not-allowed opacity-60"
                } ${isBestDeal && isEligible ? "ring-1 ring-primary/50" : ""}`}
                onClick={() => isEligible && handlePromotionSelect(promotion)}
              >
                {/* Best Deal Badge */}
                {isBestDeal && isEligible && (
                  <div className="absolute -top-2 right-2">
                    <div className="bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {t("Booking.hot")}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {/* Selection indicator */}
                  <div>
                    {isSelected ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isEligible ? "default" : "secondary"}
                        className={`text-xs px-2 py-1 ${
                          isEligible
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {promotion.discountType === "PERCENTAGE" ? (
                          <span>
                            {t("Booking.discountLabel")}{" "}
                            {formatDiscountValue(promotion)}
                          </span>
                        ) : (
                          <span>
                            {t("Booking.discountLabel")}{" "}
                            {formatDiscountValue(promotion)}
                          </span>
                        )}
                      </Badge>
                    </div>

                    <p
                      className={`text-sm font-medium ${
                        isEligible ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {getDiscountDisplay(promotion)}
                    </p>
                    <p
                      className={`text-xs ${
                        isEligible
                          ? "text-muted-foreground"
                          : "text-muted-foreground/70"
                      }`}
                    >
                      {t("Booking.orderFrom")}{" "}
                      {promotion.minOrderValue?.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedPromotion && (
          <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <p className="text-primary font-medium text-sm">
                  {t("Booking.appliedSave")}{" "}
                  <span className="font-bold">
                    {calculateDiscount(
                      selectedPromotion,
                      originalPrice
                    )?.toLocaleString("vi-VN")}
                    đ
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
