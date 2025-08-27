import { cookies } from "next/headers";

export default async function POST(req: Request) {
  const locale = await req.json();
  const store = await cookies();
  store.set("locale", locale);
  return Response.json({ success: true });
}
