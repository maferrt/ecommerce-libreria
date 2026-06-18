import type { CartItem } from "@/types/cart";

export type OrderStatus =
  | "Pagado"
  | "Pendiente"
  | "En preparación"
  | "Entregado"
  | "Cancelado";

export type UserOrder = {
  id: string;
  userId: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  totalItems: number;
  paidAmount: number;
};