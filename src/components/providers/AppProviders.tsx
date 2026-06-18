"use client";

import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AccountProvider } from "@/context/AccountContext";
import { CartProvider } from "@/context/CartContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AccountProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </AccountProvider>
  );
}