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
import {
  checkoutRequest,
  getOrdersRequest,
} from "@/lib/order-api";
import type {
  ApiOrderItem,
  ApiOrderResponse,
  ApiOrderStatus,
} from "@/lib/api-types";
import type { CartItem } from "@/types/cart";
import type { OrderStatus, UserOrder } from "@/types/order";

type CreateOrderResult = {
  ok: boolean;
  message: string;
  orderId?: string;
};

type OrderContextValue = {
  orders: UserOrder[];
  totalOrders: number;
  createOrder: (
    paymentMethod?: string,
    deliveryNotes?: string,
  ) => Promise<CreateOrderResult>;
  clearOrders: () => void;
  refreshOrders: () => Promise<void>;
};

const OrderContext = createContext<OrderContextValue | null>(null);

function mapOrderStatus(status: ApiOrderStatus): OrderStatus {
  const statusMap: Record<ApiOrderStatus, OrderStatus> = {
    CREATED: "Pendiente",
    PAID: "Pagado",
    PREPARING: "En preparación",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
  };

  return statusMap[status] ?? "Pendiente";
}

function toCartItem(apiItem: ApiOrderItem): CartItem {
  const isSaga = apiItem.type === "SAGA";

  return {
    id: String(apiItem.id),
    type: isSaga ? "saga" : "book",
    productId: isSaga ? apiItem.sagaId ?? "" : apiItem.bookId ?? 0,
    title: apiItem.title,
    subtitle: apiItem.author,
    image: apiItem.coverImage,
    price: Number(apiItem.unitPrice),
    quantity: apiItem.quantity,
    meta: isSaga ? "Paquete de saga" : "Libro",
  };
}

function toUserOrder(apiOrder: ApiOrderResponse): UserOrder {
  return {
    id: String(apiOrder.id),
    orderNumber: apiOrder.orderNumber,
    userId: "",
    createdAt: apiOrder.createdAt,
    status: mapOrderStatus(apiOrder.status),
    items: apiOrder.items.map(toCartItem),
    totalItems: apiOrder.totalItems,
    paidAmount: Number(apiOrder.total),
    paymentMethod: apiOrder.paymentMethod,
    deliveryNotes: apiOrder.deliveryNotes,
    shippingAddress: {
      street: apiOrder.shippingAddress.street,
      exteriorNumber: apiOrder.shippingAddress.exteriorNumber,
      interiorNumber: apiOrder.shippingAddress.interiorNumber,
      neighborhood: apiOrder.shippingAddress.neighborhood,
      city: apiOrder.shippingAddress.city,
      state: apiOrder.shippingAddress.state,
      zipCode: apiOrder.shippingAddress.zipCode,
      country: apiOrder.shippingAddress.country,
      references: apiOrder.shippingAddress.references,
    },
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "No se pudo generar el pedido.";
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const { currentUser, isAuthenticated } = useAccount();
  const [orders, setOrders] = useState<UserOrder[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      if (!isAuthenticated || !currentUser) {
        setOrders([]);
        return;
      }

      try {
        const response = await getOrdersRequest();

        if (!isMounted) return;

        setOrders(response.map(toUserOrder));
      } catch {
        if (!isMounted) return;

        setOrders([]);
      }
    }

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, [currentUser, isAuthenticated]);

  const totalOrders = useMemo(() => {
    return orders.length;
  }, [orders]);

  async function refreshOrders() {
    if (!isAuthenticated || !currentUser) {
      setOrders([]);
      return;
    }

    const response = await getOrdersRequest();

    setOrders(response.map(toUserOrder));
  }

  async function createOrder(
    paymentMethod = "Simulado",
    deliveryNotes = "",
  ): Promise<CreateOrderResult> {
    if (!isAuthenticated || !currentUser) {
      return {
        ok: false,
        message: "Inicia sesión para generar un pedido.",
      };
    }

    try {
      const response = await checkoutRequest({
        paymentMethod,
        deliveryNotes,
      });

      const newOrder = toUserOrder(response);

      setOrders((currentOrders) => [newOrder, ...currentOrders]);

      return {
        ok: true,
        message: "Pedido generado correctamente.",
        orderId: newOrder.id,
      };
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error),
      };
    }
  }

  function clearOrders() {
    setOrders([]);
  }

  const value: OrderContextValue = {
    orders,
    totalOrders,
    createOrder,
    clearOrders,
    refreshOrders,
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