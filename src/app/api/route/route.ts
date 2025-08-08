import { getAllRoutes } from "@/lib/data/route_api";

export async function GET(req: Request) {
  console.log(req.url);
  const routes = await getAllRoutes();
  return new Response(JSON.stringify(routes), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
