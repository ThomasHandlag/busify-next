"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Percent, DollarSign } from "lucide-react";
import {
  getCurrentPromotionCampaigns,
  type PromotionCampaign,
  type Promotion as APIPromotion,
} from "@/lib/data/promotion";

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

      console.log("Used promotions response status:", response.status);
      console.log("Used promotions response:", response);

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
      ? `Giảm ${discount?.toLocaleString("vi-VN")}đ`
      : "Không đủ điều kiện";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-green-600" />
            Khuyến mãi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
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
        <CardTitle className="flex items-center gap-2">
          <Percent className="w-5 h-5 text-green-600" />
          Khuyến mãi
        </CardTitle>
        <p className="text-sm text-gray-600">
          Chọn một trong các khuyến mãi dưới đây để được giảm giá
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {autoPromotions.map((promotion) => {
            const isSelected = selectedPromotion?.id === promotion.id;
            const discount = calculateDiscount(promotion, originalPrice);
            const isEligible = discount > 0;

            return (
              <div
                key={promotion.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-md"
                    : isEligible
                    ? "border-gray-200 hover:border-green-300 hover:shadow-sm"
                    : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                }`}
                onClick={() => isEligible && handlePromotionSelect(promotion)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {isSelected ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={isEligible ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {promotion.discountType === "PERCENTAGE" ? (
                            <Percent className="w-3 h-3 mr-1" />
                          ) : (
                            <DollarSign className="w-3 h-3 mr-1" />
                          )}
                          {formatDiscountValue(promotion)}
                        </Badge>
                        {promotion.campaignTitle && (
                          <span className="text-xs text-gray-500">
                            {promotion.campaignTitle}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {getDiscountDisplay(promotion)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Đơn hàng từ{" "}
                        {promotion.minOrderValue?.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedPromotion && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">
                Đã áp dụng: Giảm{" "}
                {calculateDiscount(
                  selectedPromotion,
                  originalPrice
                )?.toLocaleString("vi-VN")}
                đ
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
