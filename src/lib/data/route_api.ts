import api from "./axios-instance";
import { AsyncCallback } from "./response_error";

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

export async function getPopularRoutes(
  callback: AsyncCallback
): Promise<BusifyRoute[]> {
  const res = await api.get("api/routes/popular-routes");
  if (res.status !== 200) {
    callback("Failed to fetch popular routes");
  }
  return res.data.result as BusifyRoute[];
}

export async function getAllRoutesServer(): Promise<BusifyRouteDetail[]> {
  const res = await api.get("api/routes");
  if (res.status !== 200) {
    throw new Error("Failed to fetch all routes");
  }
  return res.data.result as BusifyRouteDetail[];
}

export async function getAllRoutesClient(
  callback: AsyncCallback
): Promise<BusifyRouteDetail[]> {
  const res = await fetch("/api/route");
  if (!res.ok) {
    callback("Failed to fetch client routes");
    return [];
  }
  const data = await res.json();
  return data as BusifyRouteDetail[];
}
