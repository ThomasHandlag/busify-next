// lib/data/operator.ts
import axios from "./axios-instance";
import api from "./axios-instance";

export interface BusOperator {
  id: number;
  name: string;
  logo: string;
  description: string;
  averageRating: number;
  hotline: string;
  totalReviews: number;
}

export async function getAllBusOperators(): Promise<BusOperator[]> {
  try {
    const res = await axios.get("/api/bus-operators");
    return res.data.result;
  } catch (error) {
    console.error("Error fetching bus operators:", error);
    return [];
  }
}

export async function getBusOperatorsRating(
  limit = 10
): Promise<BusOperator[]> {
  try {
    const res = await api.get(`api/bus-operators/rating?limit=${limit}`);
    return res.data.result as BusOperator[];
  } catch (error) {
    console.error("Error fetching bus operators rating:", error);
    throw error;
  }
}
