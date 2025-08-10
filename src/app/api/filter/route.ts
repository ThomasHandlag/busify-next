import { filterTrips, TripFilterQuery } from "@/lib/data/trip";

export async function POST(req: Request) {
    const body = await req.json();
    const filters: TripFilterQuery = body;
    const trips = await filterTrips(filters);
<<<<<<< HEAD

=======
    console.log("Filtered trips from cli:", trips);
>>>>>>> origin/dev
    return new Response(JSON.stringify({ result: trips }), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}
