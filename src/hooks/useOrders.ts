"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Order, QueueConfig } from "@/data/orderTypes";

// ─── Poll a single order (customer view) ───

export function useOrderStatus(orderId: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const poll = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) setOrder(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    poll();
    if (!orderId) return;
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [poll, orderId]);

  return { order, loading, refetch: poll };
}

// ─── Poll all orders today (admin view) ───

export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [poll]);

  // Optimistic update: instantly change local state, fire API in background
  const optimisticUpdate = useCallback(
    (orderId: string, updates: Partial<Order>) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
      );
      // Fire API in background (don't await)
      fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }).catch(() => {
        // Revert on failure by refetching
        poll();
      });
    },
    [poll]
  );

  return { orders, loading, refetch: poll, optimisticUpdate };
}

// ─── Queue config ───

export function useQueueConfig() {
  const [config, setConfig] = useState<QueueConfig | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/queue-config", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.minutesPerQueue !== undefined) setConfig(data);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async (updated: QueueConfig) => {
    try {
      const res = await fetch("/api/queue-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved && saved.minutesPerQueue !== undefined) setConfig(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  return { config, save, reload: load };
}

// ─── Count queues ahead for a specific order ───

export function useQueuesAhead(orderId: string | null) {
  const [queuesAhead, setQueuesAhead] = useState(0);
  const prevAhead = useRef(0);

  useEffect(() => {
    if (!orderId) return;

    const poll = async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;

        const allOrders: Order[] = data;
        const myOrder = allOrders.find((o) => o.id === orderId);
        if (!myOrder || myOrder.status === "ready") {
          setQueuesAhead(0);
          return;
        }

        const ahead = allOrders.filter(
          (o) =>
            o.status === "preparing" &&
            o.queueNumber < myOrder.queueNumber
        ).length;

        const newAhead = Math.min(ahead, prevAhead.current || ahead);
        prevAhead.current = newAhead;
        setQueuesAhead(newAhead);
      } catch {
        // ignore
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  return queuesAhead;
}
