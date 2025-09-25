import { BASE_URL } from "@/lib/constants/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return Response.json({ error: "Email is required." }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format." }, { status: 400 });
    }

    // Call backend API to send reset password email
    const backendUrl = BASE_URL || "http://localhost:8080";
    const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        { error: errorData.message || "Failed to send reset email." },
        { status: response.status }
      );
    }

    const data = await response.json();

    return Response.json({
      message:
        "Reset password email sent successfully. Please check your inbox.",
      ...data,
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return Response.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
