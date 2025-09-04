import ResponseError from "@/lib/data/response_error";
import { updateUserProfileServer } from "@/lib/data/users";

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
    const updatedProfile = await updateUserProfileServer(userId, data);
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
