import { put, list, del } from "@vercel/blob";
import { Order, QueueConfig, defaultQueueConfig } from "@/data/orderTypes";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function ordersKey(dayKey?: string): string {
  return `orders-${dayKey || todayKey()}.json`;
}

const CONFIG_KEY = "queue-config.json";

// ─── Queue Config ───

export async function getQueueConfig(): Promise<QueueConfig> {
  try {
    const { blobs } = await list({ prefix: CONFIG_KEY });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url);
      const config: QueueConfig = await res.json();
      return config;
    }
  } catch {
    // fall through to default
  }
  return { ...defaultQueueConfig, currentDayKey: todayKey() };
}

export async function saveQueueConfig(config: QueueConfig): Promise<QueueConfig> {
  // delete old blob first
  try {
    const { blobs } = await list({ prefix: CONFIG_KEY });
    for (const b of blobs) await del(b.url);
  } catch {
    // ignore
  }
  await put(CONFIG_KEY, JSON.stringify(config), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return config;
}

// ─── Orders ───

export async function getOrders(dayKey?: string): Promise<Order[]> {
  const key = ordersKey(dayKey);
  try {
    const { blobs } = await list({ prefix: key });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url);
      const orders: Order[] = await res.json();
      return orders;
    }
  } catch {
    // fall through
  }
  return [];
}

export async function saveOrders(orders: Order[], dayKey?: string): Promise<void> {
  const key = ordersKey(dayKey);
  // delete old
  try {
    const { blobs } = await list({ prefix: key });
    for (const b of blobs) await del(b.url);
  } catch {
    // ignore
  }
  await put(key, JSON.stringify(orders), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function createOrder(
  order: Omit<Order, "id" | "queueNumber" | "status" | "createdAt">
): Promise<Order> {
  const config = await getQueueConfig();
  const day = todayKey();

  // Auto-reset if day changed
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
  await saveQueueConfig(config);

  const orders = await getOrders(day);
  orders.push(newOrder);
  await saveOrders(orders, day);

  return newOrder;
}

export async function getOrderById(id: string): Promise<Order | null> {
  // Extract day from id format: "YYYY-MM-DD-queue-random"
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
  return blob.url;
}

// ─── Queue reset ───

export async function resetQueue(): Promise<void> {
  const config = await getQueueConfig();
  config.nextQueueNumber = 1;
  config.currentDayKey = todayKey();
  await saveQueueConfig(config);
}
