// lib/data/route.ts
import axios from "./axios-instance";

export interface Route {
  id: number;
  name: string;
}

export async function getAllRoutes(): Promise<Route[]> {
  try {
    const res = await axios.get("/api/routes");
    return res.data.result;
  } catch (error) {
    console.error("Error fetching routes:", error);
    return [];
  }
}
