import { BASE_URL } from "@/lib/constants/constants";
import ResponseError from "@/lib/data/response_error";

export async function GET(req: Request) {
  try {
    const headers = req.headers;
    const response = await fetch(`${BASE_URL}/api/users/profile`, {
      method: "GET",
      headers,
    });
    console.log("Response status:", response);
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    const responseError = error as ResponseError;
    console.error("Error fetching profile:", responseError);
    return new Response(JSON.stringify({ error: responseError.message }), {
      status: 500,
    });
  }
}
