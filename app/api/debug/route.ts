import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // This shows up in the laptop terminal where npm run dev is running
    console.log("[📱 MOBILE]", JSON.stringify(body));
  } catch {
    // ignore
  }
  return Response.json({ ok: true });
}
