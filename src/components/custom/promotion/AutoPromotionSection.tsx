"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Gift, Star } from "lucide-react";
import {
  getCurrentPromotionCampaigns,
  type PromotionCampaign,
  type Promotion as APIPromotion,
} from "@/lib/data/promotion";
import { useTranslations } from "next-intl";

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

interface UsedPromotion {
  userId: number;
  userEmail: string;
  promotionId: number;
  promotionCode: string;
  discountType: string;
  discountValue: number;
  promotionStartDate: string;
  promotionEndDate: string;
  claimedAt: string;
  usedAt: string;
  isUsed: boolean;
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
  // Function to fetch used promotions for the current user
  const fetchUsedPromotions = useCallback(async (): Promise<number[]> => {
    try {
      // Get session from hook - no need to await
      if (!session?.user?.accessToken) {
        console.log("No session or access token found");
        return []; // Return empty array if no session
      }

      console.log(
        "Fetching used promotions with token:",
        session.user.accessToken.substring(0, 20) + "..."
      );

      const response = await fetch(
        `http://localhost:8080/api/promotions/user/used`,
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
        // Extract promotionId from used promotions
        const usedIds = data.result.map(
          (item: UsedPromotion) => item.promotionId
        );
        return usedIds;
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch used promotions:", error);
      // Return empty array on error to not block the UI
      return [];
    }
  }, [session?.user?.accessToken]); // Only depend on accessToken

  useEffect(() => {
    const fetchAutoPromotions = async () => {
      try {
        setLoading(true);

        // Fetch both campaigns and used promotions in parallel
        const [campaigns, usedPromotionIds] = await Promise.all([
          getCurrentPromotionCampaigns(),
          fetchUsedPromotions(),
        ]);

        // Extract all auto promotions from campaigns
        const allAutoPromotions: Promotion[] = [];

        campaigns.forEach((campaign: PromotionCampaign) => {
          campaign.promotions?.forEach((promotion: APIPromotion) => {
            if (
              promotion.promotionType === "auto" &&
              promotion.status === "active" &&
              !usedPromotionIds.includes(promotion.id) // Filter out used promotions
            ) {
              allAutoPromotions.push({
                ...promotion,
                campaignTitle: campaign.title,
              });
            }
          });
        });

        // Sort by discountValue descending to get best promotion first
        allAutoPromotions.sort((a, b) => {
          const discountA = calculateDiscount(a, originalPrice);
          const discountB = calculateDiscount(b, originalPrice);
          return discountB - discountA;
        });

        setAutoPromotions(allAutoPromotions);

        // Auto-select the best promotion only once when data loads
        if (allAutoPromotions.length > 0 && !hasAutoSelected) {
          const bestPromotion = allAutoPromotions[0];
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
  }, [originalPrice, onPromotionSelect, hasAutoSelected, fetchUsedPromotions]); // Include all dependencies

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
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 py-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Gift className="w-5 h-5 text-orange-600" />
            <span className="text-orange-600 font-semibold">
              {t("Booking.specialOffersLoading")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-2">
            {[...Array(1)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg"></div>
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
    <Card className="overflow-hidden shadow-md border-0 pt-0">
      <CardHeader className="bg-gradient-to-r from-orange-300 to-red-300 text-red-400 py-3 px-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Gift className="w-5 h-5" />
          <span className="font-semibold">🎉 {t("Booking.offers")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          {autoPromotions.slice(0, 2).map((promotion, index) => {
            const isSelected = selectedPromotion?.id === promotion.id;
            const discount = calculateDiscount(promotion, originalPrice);
            const isEligible = discount > 0;
            const isBestDeal = index === 0;

            return (
              <div
                key={promotion.id}
                className={`relative border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-orange-200 bg-orange-50 shadow-md"
                    : isEligible
                    ? "border-gray-200 hover:border-orange-300 bg-white hover:shadow-sm"
                    : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                } ${isBestDeal && isEligible ? "ring-1 ring-orange-300" : ""}`}
                onClick={() => isEligible && handlePromotionSelect(promotion)}
              >
                {/* Best Deal Badge */}
                {isBestDeal && isEligible && (
                  <div className="absolute -top-2 left-3">
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {t("Booking.hot")}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {/* Selection indicator */}
                  <div>
                    {isSelected ? (
                      <CheckCircle className="w-5 h-5 text-orange-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={isEligible ? "default" : "secondary"}
                        className={`text-xs px-2 py-1 ${
                          isEligible
                            ? "bg-orange-300 text-white"
                            : "bg-gray-300 text-gray-600"
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
                        isEligible ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {getDiscountDisplay(promotion)}
                    </p>
                    <p
                      className={`text-xs ${
                        isEligible ? "text-gray-600" : "text-gray-400"
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
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className="flex-1">
                <p className="text-green-700 font-medium text-sm">
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
