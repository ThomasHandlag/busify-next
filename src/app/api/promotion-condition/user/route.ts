import { BASE_URL } from "@/lib/constants/constants";
import ResponseError from "@/lib/data/response_error";

export async function GET(req: Request) {
  const headers = req.headers;

  const res = await fetch(`${BASE_URL}api/promotions/user/conditions`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const errorData = (await res.json()) as ResponseError;
    return new Response(
      JSON.stringify({
        success: false,
        code: res.status,
        message: errorData.message || "Failed to fetch user conditions",
      }),
      {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const data = await res.json();
  return new Response(
    JSON.stringify({ success: true, code: 200, result: data.result }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
