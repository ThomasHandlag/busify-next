import { getAllBusModels } from "@/lib/data/bus";

export async function GET(req: Request) {
  console.log("Fetching bus models...", req.body);
  const busModels = await getAllBusModels();
  return new Response(
    JSON.stringify({
      result: busModels,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
