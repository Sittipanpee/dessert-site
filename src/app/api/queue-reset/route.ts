import { NextResponse } from "next/server";
import { resetQueue } from "@/lib/blobStorage";

export async function POST() {
  try {
    await resetQueue();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("POST /api/queue-reset error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
