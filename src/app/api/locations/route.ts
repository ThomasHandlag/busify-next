import { getAllLocationsServer } from "@/lib/data/location";

export async function GET() {
  const locations = await getAllLocationsServer();
  return new Response(JSON.stringify(locations), {
    headers: { "Content-Type": "application/json" },
  });
}
