import { filterTrips, TripFilterQuery } from "@/lib/data/trip";

export async function POST(req: Request) {
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const filters: TripFilterQuery = body;
  const trips = await filterTrips(
    filters,
    Number(searchParams.get("page")) || 1
  );
  console.log("Filtered trips from cli:", trips);
  return new Response(JSON.stringify({ result: trips }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
