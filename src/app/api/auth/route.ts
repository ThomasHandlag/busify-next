export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required." }),
        { status: 400 }
      );
    }

    // Here you would typically check the credentials against a database
    // For demonstration, we assume a successful login
    return new Response(
      JSON.stringify({ message: "Login successful", user: { username } }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "An error occurred during login.",  detail: error }),
      { status: 500 }
    );
  }
};
