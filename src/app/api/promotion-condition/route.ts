import { BASE_URL } from "@/lib/constants/constants";
import ResponseError from "@/lib/data/response_error";

export async function POST(req: Request) {
  const { conditionId, progressData, accessToken } = await req.json();

  console.log("API route received:", {
    conditionId,
    progressData,
    accessToken: accessToken ? "present" : "missing",
  });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  console.log("Making request to backend with headers:", headers);

  const response = await fetch(
    `${BASE_URL}api/promotions/condition/${conditionId}/progress`,
    {
      method: "POST",
      headers,
      body: progressData,
    }
  );

  console.log("Backend response status:", response.status);

  if (!response.ok) {
    const errorData = (await response.json()) as ResponseError;
    console.log(errorData);
    return new Response(
      JSON.stringify({
        success: false,
        message: errorData.message || "Failed to update condition progress",
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

  const result = await response.json();
  return new Response(JSON.stringify({ success: true, result, code: 200 }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
