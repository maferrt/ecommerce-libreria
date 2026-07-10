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
  addCartBookRequest,
  addCartSagaRequest,
  clearCartRequest,
  getCartRequest,
  removeCartItemRequest,
  updateCartItemQuantityRequest,
} from "@/lib/cart-api";
import type { ApiCartItem, ApiCartResponse } from "@/lib/api-types";
import type { Book, Saga } from "@/types/book";
import type { AddCartItemInput, CartItem } from "@/types/cart";

type CartActionResult = {
  ok: boolean;
  message: string;
};

type CartContextValue = {
  items: CartItem[];
  isCartOpen: boolean;
  totalItems: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: AddCartItemInput) => Promise<CartActionResult>;
  addBook: (book: Book) => Promise<CartActionResult>;
  addSaga: (
    saga: Saga,
    includedBooksCount: number,
  ) => Promise<CartActionResult>;
  incrementItem: (itemId: string) => Promise<CartActionResult>;
  decrementItem: (itemId: string) => Promise<CartActionResult>;
  removeItem: (itemId: string) => Promise<CartActionResult>;
  clearCart: () => Promise<CartActionResult>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

function toCartItem(apiItem: ApiCartItem): CartItem {
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

function mapCartResponse(response: ApiCartResponse) {
  return response.items.map(toCartItem);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "No se pudo actualizar el carrito.";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { currentUser, isAuthenticated } = useAccount();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCart() {
      if (!isAuthenticated || !currentUser) {
        setItems([]);
        return;
      }

      try {
        const response = await getCartRequest();

        if (!isMounted) return;

        setItems(mapCartResponse(response));
      } catch {
        if (!isMounted) return;

        setItems([]);
      }
    }

    void loadCart();

    return () => {
      isMounted = false;
    };
  }, [currentUser, isAuthenticated]);

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

  async function refreshCart() {
    if (!isAuthenticated || !currentUser) {
      setItems([]);
      return;
    }

    const response = await getCartRequest();

    setItems(mapCartResponse(response));
  }

  async function addItem(
    item: AddCartItemInput,
  ): Promise<CartActionResult> {
    if (!isAuthenticated || !currentUser) {
      return {
        ok: false,
        message: "Inicia sesión para agregar productos al carrito.",
      };
    }

    try {
      const response =
        item.type === "book"
          ? await addCartBookRequest(Number(item.productId))
          : await addCartSagaRequest(String(item.productId));

      setItems(mapCartResponse(response));
      openCart();

      return {
        ok: true,
        message: "Producto agregado al carrito.",
      };
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error),
      };
    }
  }

  function addBook(book: Book) {
    return addItem({
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
    return addItem({
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

  async function incrementItem(itemId: string): Promise<CartActionResult> {
    if (!isAuthenticated || !currentUser) {
      return {
        ok: false,
        message: "Inicia sesión para modificar el carrito.",
      };
    }

    const item = items.find((currentItem) => currentItem.id === itemId);

    if (!item) {
      return {
        ok: false,
        message: "Producto no encontrado en el carrito.",
      };
    }

    try {
      const response = await updateCartItemQuantityRequest(
        Number(itemId),
        item.quantity + 1,
      );

      setItems(mapCartResponse(response));

      return {
        ok: true,
        message: "Cantidad actualizada.",
      };
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error),
      };
    }
  }

  async function decrementItem(itemId: string): Promise<CartActionResult> {
    if (!isAuthenticated || !currentUser) {
      return {
        ok: false,
        message: "Inicia sesión para modificar el carrito.",
      };
    }

    const item = items.find((currentItem) => currentItem.id === itemId);

    if (!item) {
      return {
        ok: false,
        message: "Producto no encontrado en el carrito.",
      };
    }

    try {
      if (item.quantity <= 1) {
        const response = await removeCartItemRequest(Number(itemId));

        setItems(mapCartResponse(response));

        return {
          ok: true,
          message: "Producto eliminado del carrito.",
        };
      }

      const response = await updateCartItemQuantityRequest(
        Number(itemId),
        item.quantity - 1,
      );

      setItems(mapCartResponse(response));

      return {
        ok: true,
        message: "Cantidad actualizada.",
      };
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error),
      };
    }
  }

  async function removeItem(itemId: string): Promise<CartActionResult> {
    if (!isAuthenticated || !currentUser) {
      return {
        ok: false,
        message: "Inicia sesión para modificar el carrito.",
      };
    }

    try {
      const response = await removeCartItemRequest(Number(itemId));

      setItems(mapCartResponse(response));

      return {
        ok: true,
        message: "Producto eliminado del carrito.",
      };
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error),
      };
    }
  }

  async function clearCart(): Promise<CartActionResult> {
    if (!isAuthenticated || !currentUser) {
      return {
        ok: false,
        message: "Inicia sesión para modificar el carrito.",
      };
    }

    try {
      const response = await clearCartRequest();

      setItems(mapCartResponse(response));

      return {
        ok: true,
        message: "Carrito vaciado correctamente.",
      };
    } catch (error) {
      return {
        ok: false,
        message: getErrorMessage(error),
      };
    }
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
    refreshCart,
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