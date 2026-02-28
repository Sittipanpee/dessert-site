import { put, list, del } from "@vercel/blob";
import { Order, QueueConfig, defaultQueueConfig } from "@/data/orderTypes";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function ordersKey(dayKey?: string): string {
  return `orders-${dayKey || todayKey()}.json`;
}

const CONFIG_KEY = "queue-config.json";

// Read blob: list by prefix, take most recent (last), fetch it
// Also clean up older duplicates in background
async function readBlobJson<T>(prefix: string): Promise<T | null> {
  const { blobs } = await list({ prefix });
  if (blobs.length === 0) return null;

  // blobs sorted by uploadedAt asc → last = newest
  const latest = blobs[blobs.length - 1];

  // Clean up older duplicates (fire-and-forget)
  if (blobs.length > 1) {
    Promise.all(
      blobs.slice(0, -1).map((b) => del(b.url).catch(() => {}))
    ).catch(() => {});
  }

  const res = await fetch(latest.downloadUrl);
  if (!res.ok) return null;
  return res.json();
}

// Write blob: just put (no delete first — much faster)
async function writeBlobJson(key: string, data: unknown): Promise<void> {
  await put(key, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

// ─── Queue Config ───

export async function getQueueConfig(): Promise<QueueConfig> {
  try {
    const config = await readBlobJson<QueueConfig>(CONFIG_KEY);
    if (config) return config;
  } catch {
    // fall through
  }
  return { ...defaultQueueConfig, currentDayKey: todayKey() };
}

export async function saveQueueConfig(config: QueueConfig): Promise<QueueConfig> {
  await writeBlobJson(CONFIG_KEY, config);
  return config;
}

// ─── Orders ───

export async function getOrders(dayKey?: string): Promise<Order[]> {
  try {
    const orders = await readBlobJson<Order[]>(ordersKey(dayKey));
    if (orders && Array.isArray(orders)) return orders;
  } catch {
    // fall through
  }
  return [];
}

export async function saveOrders(orders: Order[], dayKey?: string): Promise<void> {
  await writeBlobJson(ordersKey(dayKey), orders);
}

export async function createOrder(
  order: Omit<Order, "id" | "queueNumber" | "status" | "createdAt">
): Promise<Order> {
  const config = await getQueueConfig();
  const day = todayKey();

  if (config.currentDayKey !== day) {
    config.currentDayKey = day;
    config.nextQueueNumber = 1;
  }

  const newOrder: Order = {
    ...order,
    id: `${day}-${config.nextQueueNumber}-${Date.now().toString(36)}`,
    queueNumber: config.nextQueueNumber,
    status: "preparing",
    createdAt: new Date().toISOString(),
  };

  config.nextQueueNumber += 1;

  // Save config and orders in parallel
  const orders = await getOrders(day);
  orders.push(newOrder);
  await Promise.all([saveQueueConfig(config), saveOrders(orders, day)]);

  return newOrder;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const dayKey = id.slice(0, 10);
  const orders = await getOrders(dayKey);
  return orders.find((o) => o.id === id) || null;
}

export async function updateOrder(
  id: string,
  updates: Partial<Pick<Order, "status" | "paymentProofUrl">>
): Promise<Order | null> {
  const dayKey = id.slice(0, 10);
  const orders = await getOrders(dayKey);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  orders[idx] = { ...orders[idx], ...updates };
  await saveOrders(orders, dayKey);
  return orders[idx];
}

// ─── Upload proof ───

export async function uploadProof(file: File, orderId: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `proofs/${orderId}.${ext}`;
  const blob = await put(path, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });
  return blob.downloadUrl;
}

// ─── Queue reset ───

export async function resetQueue(): Promise<void> {
  const config = await getQueueConfig();
  config.nextQueueNumber = 1;
  config.currentDayKey = todayKey();
  await saveQueueConfig(config);
}
