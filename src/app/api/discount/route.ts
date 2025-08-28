import { getDiscount } from "@/lib/data/discount";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const discountCode = body.code;

    if (!discountCode) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing discount code" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const discount = await getDiscount(discountCode);
    return new Response(JSON.stringify({ success: true, discount }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching discount:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Mã giảm giá không tồn tại hoặc đã hết hạn",
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
