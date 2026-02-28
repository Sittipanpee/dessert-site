import { getSupabase } from "./supabase";
import { Order, QueueConfig, defaultQueueConfig } from "@/data/orderTypes";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Queue Config ───

export async function getQueueConfig(): Promise<QueueConfig> {
  const { data, error } = await getSupabase()
    .from("queue_config")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) {
    return { ...defaultQueueConfig, currentDayKey: todayKey() };
  }

  return {
    promptPayNumber: data.prompt_pay_number,
    accountName: data.account_name || "",
    accountNumber: data.account_number || "",
    minutesPerQueue: data.minutes_per_queue,
    autoResetTime: data.auto_reset_time,
    currentDayKey: data.current_day_key,
    nextQueueNumber: data.next_queue_number,
  };
}

export async function saveQueueConfig(config: QueueConfig): Promise<QueueConfig> {
  await getSupabase()
    .from("queue_config")
    .update({
      prompt_pay_number: config.promptPayNumber,
      account_name: config.accountName || "",
      account_number: config.accountNumber || "",
      minutes_per_queue: config.minutesPerQueue,
      auto_reset_time: config.autoResetTime,
      current_day_key: config.currentDayKey,
      next_queue_number: config.nextQueueNumber,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  return config;
}

// ─── Orders ───

export async function getOrders(dayKey?: string): Promise<Order[]> {
  const key = dayKey || todayKey();
  const { data, error } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("day_key", key)
    .order("queue_number", { ascending: true });

  if (error || !data) return [];

  return data.map(rowToOrder);
}

export async function createOrder(
  order: Omit<Order, "id" | "queueNumber" | "status" | "createdAt">
): Promise<Order> {
  const day = todayKey();

  // Get and increment queue number atomically via RPC or update
  const config = await getQueueConfig();

  if (config.currentDayKey !== day) {
    config.currentDayKey = day;
    config.nextQueueNumber = 1;
  }

  const queueNum = config.nextQueueNumber;
  config.nextQueueNumber += 1;
  await saveQueueConfig(config);

  const id = `${day}-${queueNum}-${Date.now().toString(36)}`;

  const { data, error } = await getSupabase()
    .from("orders")
    .insert({
      id,
      queue_number: queueNum,
      customer_name: order.customerName,
      customer_phone: order.customerPhone || null,
      items: order.items,
      total_price: order.totalPrice,
      payment_method: order.paymentMethod,
      status: "preparing",
      day_key: day,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create order");
  }

  return rowToOrder(data);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToOrder(data);
}

export async function updateOrder(
  id: string,
  updates: Partial<Pick<Order, "status" | "paymentProofUrl">>
): Promise<Order | null> {
  const updateData: Record<string, unknown> = {};
  if (updates.status) updateData.status = updates.status;
  if (updates.paymentProofUrl) updateData.payment_proof_url = updates.paymentProofUrl;

  const { data, error } = await getSupabase()
    .from("orders")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return null;
  return rowToOrder(data);
}

// ─── Upload proof (still uses Vercel Blob for images) ───

export async function uploadProof(file: File, orderId: string): Promise<string> {
  // Upload to Supabase Storage
  const ext = file.name.split(".").pop() || "jpg";
  const path = `proofs/${orderId}.${ext}`;

  const { data, error } = await getSupabase().storage
    .from("payment-proofs")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data: urlData } = getSupabase().storage
    .from("payment-proofs")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// ─── Queue reset ───

export async function resetQueue(): Promise<void> {
  await getSupabase()
    .from("queue_config")
    .update({
      next_queue_number: 1,
      current_day_key: todayKey(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
}

// ─── Helper: convert DB row to Order type ───

function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    queueNumber: row.queue_number as number,
    customerName: row.customer_name as string,
    customerPhone: (row.customer_phone as string) || undefined,
    items: row.items as Order["items"],
    totalPrice: Number(row.total_price),
    paymentMethod: row.payment_method as Order["paymentMethod"],
    paymentProofUrl: (row.payment_proof_url as string) || undefined,
    status: row.status as Order["status"],
    createdAt: row.created_at as string,
  };
}
