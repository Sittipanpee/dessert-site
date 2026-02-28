export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  queueNumber: number;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: "promptpay" | "cash";
  paymentProofUrl?: string;
  status: "preparing" | "ready";
  createdAt: string;
}

export interface QueueConfig {
  promptPayNumber: string;
  minutesPerQueue: number;
  autoResetTime: string; // "HH:mm" format
  currentDayKey: string; // "YYYY-MM-DD"
  nextQueueNumber: number;
}

export const defaultQueueConfig: QueueConfig = {
  promptPayNumber: "0812345678",
  minutesPerQueue: 5,
  autoResetTime: "06:00",
  currentDayKey: "",
  nextQueueNumber: 1,
};
