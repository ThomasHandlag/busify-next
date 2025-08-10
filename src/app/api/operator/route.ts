import { getAllBusOperators } from "@/lib/data/bus_operator";

export async function GET(req: Request) {
<<<<<<< HEAD
=======
    console.log(req.url);
>>>>>>> origin/dev
    const operators = await getAllBusOperators();
    return new Response(JSON.stringify(operators), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}