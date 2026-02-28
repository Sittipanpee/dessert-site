import { NextResponse } from "next/server";
import { uploadProof, updateOrder } from "@/lib/blobStorage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const orderId = formData.get("orderId") as string;

    if (!file || !orderId) {
      return NextResponse.json(
        { error: "Missing file or orderId" },
        { status: 400 }
      );
    }

    const url = await uploadProof(file, orderId);
    await updateOrder(orderId, { paymentProofUrl: url });
    return NextResponse.json({ url });
  } catch (e) {
    console.error("POST /api/upload-proof error:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
