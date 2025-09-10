import { getScore } from "@/lib/data/score";

export async function GET() {
  try {
    const score = await getScore();
    return new Response(
      JSON.stringify({ success: true, availablePoints: score.points }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching score:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Không lấy được điểm" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
