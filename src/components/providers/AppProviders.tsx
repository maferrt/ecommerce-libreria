"use client";

import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AccountProvider } from "@/context/AccountContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { WishlistProvider } from "@/context/WishlistContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AccountProvider>
      <OrderProvider>
        <WishlistProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </WishlistProvider>
      </OrderProvider>
    </AccountProvider>
  );
}