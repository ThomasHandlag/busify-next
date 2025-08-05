import { addReview } from "@/lib/data/reviews";

export async function POST(req: Request) {
  const reviewData = (await req.json());
  try {
    const newReview = await addReview(reviewData);
    return new Response(JSON.stringify({ result: newReview, success: true }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to add review" }), { 
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
