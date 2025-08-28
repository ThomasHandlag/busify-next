import api, { ApiFnParams } from "./axios-instance";
import ResponseError from "./response_error";

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
  {
    callback,
    localeMessage
  }: ApiFnParams
): Promise<BusifyRoute[]> {
  const res = await api.get("api/routes/popular-routes");
  const data = res.data;
  if (res.status !== 200) {
    const error = data as ResponseError;
    callback(error.message ?? localeMessage ?? "Failed to fetch popular routes");
  }
  return data.result as BusifyRoute[];
}

export async function getAllRoutesServer(): Promise<BusifyRouteDetail[]> {
  const res = await api.get("api/routes");
  if (res.status !== 200) {
    throw new Error("Failed to fetch all routes");
  }
  return res.data.result as BusifyRouteDetail[];
}

export async function getAllRoutesClient(
  params: ApiFnParams
): Promise<BusifyRouteDetail[]> {
  const res = await fetch("api/routes");
  const response = await res.json();

  if (res.status !== 200) {
    params.callback(response.message ?? params.localeMessage);
    return [];
  }
  return response.result as BusifyRouteDetail[];
}
