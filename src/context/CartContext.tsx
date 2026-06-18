"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Book, Saga } from "@/types/book";
import type { AddCartItemInput, CartItem } from "@/types/cart";

const CART_STORAGE_KEY = "mel_cart_items";

type CartContextValue = {
  items: CartItem[];
  isCartOpen: boolean;
  totalItems: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: AddCartItemInput) => void;
  addBook: (book: Book) => void;
  addSaga: (saga: Saga, includedBooksCount: number) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function safeReadCartItems() {
  if (typeof window === "undefined") return [];

  const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!rawValue) return [];

  try {
    return JSON.parse(rawValue) as CartItem[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);

  useEffect(() => {
    setItems(safeReadCartItems());
    setHasLoadedCart(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) return;

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hasLoadedCart]);

  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  function openCart() {
    setIsCartOpen(true);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  function toggleCart() {
    setIsCartOpen((currentValue) => !currentValue);
  }

  function addItem(item: AddCartItemInput) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.id === item.id,
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity: 1,
        },
      ];
    });

    openCart();
  }

  function addBook(book: Book) {
    addItem({
      id: `book-${book.id}`,
      type: "book",
      productId: book.id,
      title: book.titulo,
      subtitle: book.autor,
      image: book.portada,
      price: book.precio,
      meta: book.saga ? `Libro de la saga ${book.saga}` : "Libro individual",
    });
  }

  function addSaga(saga: Saga, includedBooksCount: number) {
    addItem({
      id: `saga-${saga.id}`,
      type: "saga",
      productId: saga.id,
      title: saga.nombre,
      subtitle: `${includedBooksCount} libros incluidos`,
      image: saga.portada,
      price: saga.precioSaga,
      meta: "Paquete de saga",
    });
  }

  function incrementItem(itemId: string) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  function decrementItem(itemId: string) {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(itemId: string) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const value: CartContextValue = {
    items,
    isCartOpen,
    totalItems,
    subtotal,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    addBook,
    addSaga,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider.");
  }

  return context;
}