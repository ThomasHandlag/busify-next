import { filterTrips, TripFilterQuery } from "@/lib/data/trip";

export async function POST(req: Request) {
  const body = await req.json();
  const filters: TripFilterQuery = body;
  const trips = await filterTrips(filters);
  console.log("Filtered trips from cli:", trips);
  return new Response(JSON.stringify({ result: trips }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
