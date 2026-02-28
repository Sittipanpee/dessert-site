import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/blobStorage";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (e) {
    console.error("GET /api/orders error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await createOrder(body);
    return NextResponse.json(order);
  } catch (e) {
    console.error("POST /api/orders error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
