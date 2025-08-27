import api from "./axios-instance";

export interface BusifyRoute {
  routeId: number;
  routeName: string;
  durationHours: string;
  startingPrice: number;
}

export interface BusifyRouteDetail {
  id: number;
  name: string;
  start_location: string;
  end_location: string;
  default_duration_minutes: number;
  default_price: number;
}

export async function getPopularRoutes(): Promise<BusifyRoute[]> {
  try {
    const res = await api.get("api/routes/popular-routes");
    return res.data.result as BusifyRoute[];
  } catch (error) {
    console.error("Error fetching popular routes:", error);
    throw error;
  }
}

export async function getAllRoutes(): Promise<BusifyRouteDetail[]> {
  try {
    const res = await api.get("api/routes");
    return res.data.result as BusifyRouteDetail[];
  } catch (error) {
    console.error("Error fetching routes:", error);
    return [];
  }
}

export async function getAllRoutesClient(): Promise<BusifyRouteDetail[]> {
  try {
    const res = await fetch("/api/route");
    if (!res.ok) {
      throw new Error("Failed to fetch client routes");
    }
    const data = await res.json();
    return data as BusifyRouteDetail[];
  } catch (error) {
    console.error("Error fetching client routes:", error);
    return [];
  }
}
