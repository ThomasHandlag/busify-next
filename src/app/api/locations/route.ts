import { getAllLocations } from "@/lib/data/location";

export async function GET() {
  const locations = await getAllLocations();
  return new Response(JSON.stringify(locations), {
    headers: { "Content-Type": "application/json" },
  });
}
