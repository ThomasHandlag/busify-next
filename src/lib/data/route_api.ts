import { ca } from "date-fns/locale";
import api from "./axios-instance";

export async function getPopularRoutes(): Promise<Response> {
  try {
    const res = await api.get("api/routes/popular-routes");
    return res.data;
  } catch (error) {
    console.error("Error fetching popular routes:", error);
    throw error;
  }
}
