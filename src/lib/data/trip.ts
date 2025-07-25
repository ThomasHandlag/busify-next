import api from "./axios-instance";

export async function getUpcomingTrips(): Promise<Response> {
  try {
    const res = await api.get("api/trips/upcoming-trips");
    return res.data;
  } catch (error) {
    console.error("Error fetching upcoming trips:", error);
    throw error;
  }
}
