import { BASE_URL } from "@/lib/constants/constants";
import ResponseError from "@/lib/data/response_error";
import { updateUserProfile } from "@/lib/data/users";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, data } = body;

    // Validate input
    if (!userId || !data) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
      });
    }

    // Update user profile
    const updatedProfile = await updateUserProfile(userId, data);
    if (!updatedProfile) {
      return new Response(
        JSON.stringify({ error: "Failed to update profile" }),
        {
          status: 500,
        }
      );
    }

    return new Response(JSON.stringify({ result: updatedProfile }), {
      status: 200,
    });
  } catch (error) {
    const responseError = error as ResponseError;
    console.error("Error updating profile:", responseError);
    return new Response(JSON.stringify({ error: responseError.message }), {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const headers = req.headers;
    const response = await fetch(`${BASE_URL}api/users/profile`, {
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
