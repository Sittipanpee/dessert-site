export interface OrderItemSelection {
  groupName: string;
  choiceNames: string[];
  addedPrice: number;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  variationName?: string; // เช่น "แก้วใหญ่" (backward compat)
  selections?: OrderItemSelection[];
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
  accountName: string;
  accountNumber: string;
  minutesPerQueue: number;
  autoResetTime: string;
  currentDayKey: string;
  nextQueueNumber: number;
}

export const defaultQueueConfig: QueueConfig = {
  promptPayNumber: "0812345678",
  accountName: "",
  accountNumber: "",
  minutesPerQueue: 5,
  autoResetTime: "06:00",
  currentDayKey: "",
  nextQueueNumber: 1,
};
