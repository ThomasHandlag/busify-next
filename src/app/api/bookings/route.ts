export async function GET(req: Request) {
  console.log(req);
  return new Response("Bookings API is under construction", { status: 501 });
}
