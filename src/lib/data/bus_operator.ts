import api from "./axios-instance";

export async function getBusOperatorsRating(limit = 10): Promise<Response> {
  try {
    const res = await api.get(`api/bus-operators/rating?limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching bus operators rating:", error);
    throw error;
  }
}
