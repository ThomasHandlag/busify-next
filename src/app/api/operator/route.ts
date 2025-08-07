import { getAllBusOperators } from "@/lib/data/bus_operator";

export async function GET(req: Request) {
    const operators = await getAllBusOperators();
    return new Response(JSON.stringify(operators), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}