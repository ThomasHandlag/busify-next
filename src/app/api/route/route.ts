import { getAllRoutesServer } from "@/lib/data/route_api";

export async function GET(req: Request) {
  console.log(req.url);
  const routes = await getAllRoutesServer();
  return new Response(JSON.stringify(routes), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
