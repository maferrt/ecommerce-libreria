import type { CartItem } from "@/types/cart";

export type OrderStatus =
  | "Pagado"
  | "Pendiente"
  | "En preparación"
  | "Enviado"
  | "Entregado"
  | "Cancelado";

export type ShippingAddress = {
  street: string;
  exteriorNumber: string;
  interiorNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  references: string;
};

export type UserOrder = {
  id: string;
  orderNumber: string;
  userId: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  totalItems: number;
  paidAmount: number;
  paymentMethod: string;
  deliveryNotes: string;
  shippingAddress: ShippingAddress;
};