import api from "./axios-instance";

export enum ConditionType {
  VIEW_VIDEO = "VIEW_VIDEO",
  COMPLETE_SURVEY = "COMPLETE_SURVEY",
  REFERRAL_COUNT = "REFERRAL_COUNT",
  FIRST_PURCHASE = "FIRST_PURCHASE",
  WATCH_AD = "WATCH_AD",
}

export interface PromotionCondition {
  conditionId: number;
  conditionType: ConditionType;
  conditionValue: string;
  isRequired: boolean;
}

export interface PromotionCampaign {
  campaignId: number;
  title: string;
  description: string;
  bannerUrl: string;
  startDate: string;
  endDate: string;
  active: boolean;
  priority: number | null;
  promotionCount: number;
  deleted: boolean;
  discountValue: number;
  discountType: string;
  promotions: Promotion[];
}

export interface Promotion {
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
  campaignId: number | null;
  conditions?: PromotionCondition[];
}

export interface PromotionCampaignsResponse {
  code: number;
  message: string;
  result: PromotionCampaign[];
}

export interface PromotionsResponse {
  code: number;
  message: string;
  result: Promotion[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result?: T;
}

export interface UserConditionProgress {
  userPromotionConditionId: number;
  promotionId: number;
  promotionCode: string | null;
  promotionType: string;
  conditionId: number;
  conditionType: ConditionType | string;
  conditionValue: string;
  isRequired: boolean;
  isCompleted: boolean;
  currentProgress: string | null;
  completedAt: string | null;
}

export async function getCurrentPromotionCampaigns(): Promise<
  PromotionCampaign[]
> {
  try {
    const response = await api.get<PromotionCampaignsResponse>(
      "api/promotion-campaigns/current-with-promotions"
    );

    const data = response.data;

    if (data.code !== 200) {
      throw new Error(data.message || "Failed to fetch promotion campaigns");
    }

    // Filter only active campaigns
    return data.result.filter(
      (campaign) => campaign.active && !campaign.deleted
    );
  } catch (error) {
    console.error("Error fetching promotion campaigns:", error);
    throw error;
  }
}

export async function getCurrentPromotions(): Promise<Promotion[]> {
  try {
    const response = await api.get<PromotionsResponse>(
      "api/promotions/current-promotions"
    );
    const data = response.data;

    console.log("Fetched promotions:", data);

    if (data.code !== 200) {
      throw new Error(data.message || "Failed to fetch promotions");
    }
    return data.result.filter((promotion) => promotion.status === "active");
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
}

export async function getPromotionConditions(
  promotionId: number
): Promise<PromotionCondition[]> {
  try {
    const response = await api.get<ApiResponse<PromotionCondition[]>>(
      `api/promotions/${promotionId}/conditions`
    );
    const data = response.data;

    if (data.code !== 200) {
      throw new Error(data.message || "Failed to fetch promotion conditions");
    }

    return data.result || [];
  } catch (error) {
    console.error("Error fetching promotion conditions:", error);
    throw error;
  }
}

export async function updateConditionProgress(
  conditionId: number,
  progressData: string,
  accessToken: string
): Promise<void> {
  try {
    console.log("progress data", progressData);
    const response = await api.post<ApiResponse<void>>(
      `api/promotions/condition/${conditionId}/progress`,
      progressData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = response.data;
    console.log("data response", data);

    if (data.code !== 200) {
      throw new Error(data.message || "Failed to update condition progress");
    }
  } catch (error) {
    console.error("Error updating condition progress:", error);
    throw error;
  }
}

// Client-side function tương tự như addReviewClient
export async function updateConditionProgressClient(
  conditionId: number,
  progressData: string,
  accessToken: string
): Promise<void> {
  try {
    console.log("updateConditionProgressClient called with:", {
      conditionId,
      progressData,
      accessToken: accessToken ? "present" : "missing",
    });

    const response = await fetch(`/api/promotion-condition`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        conditionId,
        progressData,
        accessToken,
      }),
    });

    console.log("Client response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to update condition progress"
      );
    }

    const result = await response.json();
    console.log("Condition progress updated successfully:", result);
  } catch (error) {
    console.error("Error updating condition progress:", error);
    throw error;
  }
}

export async function getUserConditionProgress(
  accessToken: string
): Promise<UserConditionProgress[]> {
  const res = await fetch(`/api/promotion-condition/user`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch user conditions");
  }

  const data: ApiResponse<UserConditionProgress[]> = await res.json();
  return data.result || [];
}

export function calculateDiscountedPrice(
  originalPrice: number,
  campaign: PromotionCampaign
): { discountedPrice: number; discountAmount: number } {
  let discountAmount = 0;

  if (campaign.discountType === "PERCENTAGE") {
    discountAmount = (originalPrice * campaign.discountValue) / 100;
  } else if (campaign.discountType === "FIXED_AMOUNT") {
    discountAmount = campaign.discountValue;
  }

  // Ensure discount doesn't exceed original price
  discountAmount = Math.min(discountAmount, originalPrice);

  const discountedPrice = originalPrice - discountAmount;

  return { discountedPrice, discountAmount };
}

export function getBestPromotionCampaign(
  campaigns: PromotionCampaign[],
  originalPrice: number
): PromotionCampaign | null {
  if (campaigns.length === 0) return null;

  // Calculate discount for each campaign and find the one with highest discount amount
  let bestCampaign = campaigns[0];
  let maxDiscount = 0;

  for (const campaign of campaigns) {
    const { discountAmount } = calculateDiscountedPrice(
      originalPrice,
      campaign
    );
    if (discountAmount > maxDiscount) {
      maxDiscount = discountAmount;
      bestCampaign = campaign;
    }
  }

  return bestCampaign;
}
