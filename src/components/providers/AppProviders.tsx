"use client";

import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/context/CartContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}