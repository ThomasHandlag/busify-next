import { BusifyRoute } from "../types/widget_proptype";
import api from "./axios-instance";

export async function getPopularRoutes(): Promise<BusifyRoute[]> {
  try {
    const res = await api.get("/api/routes/popular-routes");
    return res.data.result as BusifyRoute[];
  } catch (error) {
    console.error("Error fetching popular routes:", error);
    throw error;
  }
}

export async function getAllRoutes(): Promise<BusifyRoute[]> {
  try {
    const res = await api.get("/api/routes");
    return res.data.result as BusifyRoute[];
  } catch (error) {
    console.error("Error fetching routes:", error);
    return [];
  }
}
