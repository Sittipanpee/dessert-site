import { NextResponse } from "next/server";
import { getThemeId, saveThemeId } from "@/lib/blobStorage";

export async function GET() {
  try {
    const themeId = await getThemeId();
    return NextResponse.json({ themeId });
  } catch (e) {
    console.error("GET /api/theme error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { themeId } = await request.json();
    const saved = await saveThemeId(themeId);
    return NextResponse.json({ themeId: saved });
  } catch (e) {
    console.error("PUT /api/theme error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
