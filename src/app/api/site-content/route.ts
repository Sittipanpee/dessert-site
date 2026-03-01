import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/blobStorage";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content);
  } catch (e) {
    console.error("GET /api/site-content error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const content = await saveSiteContent(body);
    return NextResponse.json(content);
  } catch (e) {
    console.error("PUT /api/site-content error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
