import { BASE_URL } from "@/lib/constants/constants";
import ResponseError from "@/lib/data/response_error";

export async function POST(req: Request) {
  const headers = req.headers;
  const reviewData = await req.json();
  const newReview = await fetch(`${BASE_URL}api/reviews/trip`, {
    method: "POST",
    headers,
    body: JSON.stringify(reviewData),
  });
  if (!newReview.ok) {
    const errorData = (await newReview.json()) as ResponseError;
    console.log(errorData);
    return new Response(
      JSON.stringify({
        success: false,
        message: errorData.message || "Failed to add review",
        code: 400,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  const result = await newReview.json();
  return new Response(JSON.stringify({ success: true, result, code: 201 }), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
