import { NextResponse } from "next/server";
import { getQueueConfig, saveQueueConfig } from "@/lib/blobStorage";

export async function GET() {
  try {
    const config = await getQueueConfig();
    return NextResponse.json(config);
  } catch (e) {
    console.error("GET /api/queue-config error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const config = await saveQueueConfig(body);
    return NextResponse.json(config);
  } catch (e) {
    console.error("PUT /api/queue-config error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
