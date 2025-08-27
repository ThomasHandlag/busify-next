import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export default async function POST(req: NextRequest) {
  const locale = await req.json();
  const store = await cookies();
  store.set("locale", locale);
}
