import api from "./axios-instance";

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
}

export interface PromotionCampaignsResponse {
  code: number;
  message: string;
  result: PromotionCampaign[];
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
