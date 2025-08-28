import api from "./axios-instance";

export interface DiscountInfo {
  id: number;
  code: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  status: "active" | "inactive" | "expired";
}

export interface DiscountResponse {
  success: boolean;
  discount?: DiscountInfo;
  message?: string;
}

const getDiscount = async (discountCode: string): Promise<DiscountInfo> => {
  try {
    const response = await api.get(`/api/promotions/code/${discountCode}`);
    return response.data.result;
  } catch (error) {
    console.error("Error applying discount:", error);
    throw error;
  }
};

const applyDiscountClient = async (
  discountCode: string
): Promise<DiscountResponse> => {
  try {
    const res = await fetch(`/api/discount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: discountCode }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error applying discount:", error);
    throw error;
  }
};

export const calculateDiscountAmount = (
  originalPrice: number,
  discountInfo: DiscountInfo
): number => {
  if (discountInfo.discountType === "PERCENTAGE") {
    return Math.round((originalPrice * discountInfo.discountValue) / 100);
  } else {
    return discountInfo.discountValue;
  }
};

export { getDiscount, applyDiscountClient };
