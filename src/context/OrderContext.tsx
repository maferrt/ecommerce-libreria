"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAccount } from "@/context/AccountContext";
import type { CartItem } from "@/types/cart";
import type { UserOrder } from "@/types/order";

const ORDERS_STORAGE_KEY = "mel_orders";

type StoredOrders = Record<string, UserOrder[]>;

type CreateOrderResult = {
  ok: boolean;
  message: string;
  orderId?: string;
};

type OrderContextValue = {
  orders: UserOrder[];
  totalOrders: number;
  createOrder: (items: CartItem[], paidAmount: number) => CreateOrderResult;
  clearOrders: () => void;
};

const OrderContext = createContext<OrderContextValue | null>(null);

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) return fallback;

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getStoredOrders() {
  return safeReadJson<StoredOrders>(ORDERS_STORAGE_KEY, {});
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAccount();
  const [storedOrders, setStoredOrders] = useState<StoredOrders>({});
  const [hasLoadedOrders, setHasLoadedOrders] = useState(false);

  useEffect(() => {
    setStoredOrders(getStoredOrders());
    setHasLoadedOrders(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedOrders) return;

    saveJson(ORDERS_STORAGE_KEY, storedOrders);
  }, [storedOrders, hasLoadedOrders]);

  const orders = useMemo(() => {
    if (!currentUser) return [];

    return (storedOrders[currentUser.id] ?? []).sort(
      (firstOrder, secondOrder) =>
        new Date(secondOrder.createdAt).getTime() -
        new Date(firstOrder.createdAt).getTime(),
    );
  }, [currentUser, storedOrders]);

  const totalOrders = orders.length;

  function createOrder(
    items: CartItem[],
    paidAmount: number,
  ): CreateOrderResult {
    if (!currentUser) {
      return {
        ok: false,
        message: "Inicia sesión para generar un pedido.",
      };
    }

    if (items.length === 0) {
      return {
        ok: false,
        message: "Tu carrito está vacío.",
      };
    }

    const newOrder: UserOrder = {
      id: createId("order"),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      status: "Pagado",
      items: items.map((item) => ({ ...item })),
      totalItems: items.reduce((total, item) => total + item.quantity, 0),
      paidAmount,
    };

    const currentOrders = storedOrders[currentUser.id] ?? [];

    setStoredOrders((currentStoredOrders) => ({
      ...currentStoredOrders,
      [currentUser.id]: [newOrder, ...currentOrders],
    }));

    return {
      ok: true,
      message: "Pedido generado correctamente.",
      orderId: newOrder.id,
    };
  }

  function clearOrders() {
    if (!currentUser) return;

    setStoredOrders((currentStoredOrders) => ({
      ...currentStoredOrders,
      [currentUser.id]: [],
    }));
  }

  const value: OrderContextValue = {
    orders,
    totalOrders,
    createOrder,
    clearOrders,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrders debe usarse dentro de OrderProvider.");
  }

  return context;
}