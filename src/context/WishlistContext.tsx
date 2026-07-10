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
  addWishlistBookRequest,
  addWishlistSagaRequest,
  getWishlistRequest,
  removeWishlistItemRequest,
} from "@/lib/wishlist-api";
import type { ApiWishlistItem, ApiWishlistResponse } from "@/lib/api-types";
import type { Book, Saga } from "@/types/book";
import type {
  AddWishlistItemInput,
  WishlistItem,
} from "@/types/wishlist";

export type WishlistToggleResult = {
  ok: boolean;
  saved: boolean;
  message: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  totalWishlistItems: number;
  addItem: (item: AddWishlistItemInput) => Promise<WishlistToggleResult>;
  toggleItem: (item: AddWishlistItemInput) => Promise<WishlistToggleResult>;
  toggleBook: (book: Book) => Promise<WishlistToggleResult>;
  toggleSaga: (saga: Saga) => Promise<WishlistToggleResult>;
  isItemSaved: (itemId: string) => boolean;
  isBookSaved: (bookId: number) => boolean;
  isSagaSaved: (sagaId: string) => boolean;
  removeItem: (itemId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function toWishlistItem(apiItem: ApiWishlistItem): WishlistItem {
  const isSaga = apiItem.type === "SAGA";

  return {
    id: String(apiItem.id),
    type: isSaga ? "saga" : "book",
    productId: isSaga ? apiItem.sagaId ?? "" : apiItem.bookId ?? "",
    title: apiItem.title,
    subtitle: apiItem.author,
    image: apiItem.coverImage,
    price: Number(apiItem.price),
    meta: isSaga ? "Paquete de saga" : "Libro",
    createdAt: new Date().toISOString(),
  };
}

function mapWishlistResponse(response: ApiWishlistResponse) {
  return response.items.map(toWishlistItem);
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "No se pudo actualizar tu wishlist.";
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { currentUser, isAuthenticated } = useAccount();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadWishlist() {
      if (!isAuthenticated || !currentUser) {
        setItems([]);
        return;
      }

      try {
        const response = await getWishlistRequest();

        if (!isMounted) return;

        setItems(mapWishlistResponse(response));
      } catch {
        if (!isMounted) return;

        setItems([]);
      }
    }

    void loadWishlist();

    return () => {
      isMounted = false;
    };
  }, [currentUser, isAuthenticated]);

  const totalWishlistItems = items.length;

  const savedProducts = useMemo(() => {
    return new Set(
      items.map((item) => `${item.type}-${String(item.productId)}`),
    );
  }, [items]);

  function findSavedItem(item: AddWishlistItemInput) {
    return items.find(
      (currentItem) =>
        currentItem.type === item.type &&
        String(currentItem.productId) === String(item.productId),
    );
  }

  function isItemSaved(itemId: string) {
    return items.some((item) => item.id === itemId);
  }

  function isBookSaved(bookId: number) {
    return savedProducts.has(`book-${bookId}`);
  }

  function isSagaSaved(sagaId: string) {
    return savedProducts.has(`saga-${sagaId}`);
  }

  async function addItem(
    item: AddWishlistItemInput,
  ): Promise<WishlistToggleResult> {
    if (!isAuthenticated || !currentUser) {
      return {
        ok: false,
        saved: false,
        message: "Inicia sesión para guardar favoritos.",
      };
    }

    const savedItem = findSavedItem(item);

    if (savedItem) {
      return {
        ok: true,
        saved: true,
        message: "Este producto ya estaba en tu wishlist.",
      };
    }

    try {
      const response =
        item.type === "book"
          ? await addWishlistBookRequest(Number(item.productId))
          : await addWishlistSagaRequest(String(item.productId));

      setItems(mapWishlistResponse(response));

      return {
        ok: true,
        saved: true,
        message: "Producto guardado en wishlist.",
      };
    } catch (error) {
      return {
        ok: false,
        saved: false,
        message: getErrorMessage(error),
      };
    }
  }

  async function toggleItem(
    item: AddWishlistItemInput,
  ): Promise<WishlistToggleResult> {
    if (!isAuthenticated || !currentUser) {
      return {
        ok: false,
        saved: false,
        message: "Inicia sesión para guardar favoritos.",
      };
    }

    const savedItem = findSavedItem(item);

    try {
      if (savedItem) {
        const response = await removeWishlistItemRequest(Number(savedItem.id));

        setItems(mapWishlistResponse(response));

        return {
          ok: true,
          saved: false,
          message: "Producto eliminado de wishlist.",
        };
      }

      const response =
        item.type === "book"
          ? await addWishlistBookRequest(Number(item.productId))
          : await addWishlistSagaRequest(String(item.productId));

      setItems(mapWishlistResponse(response));

      return {
        ok: true,
        saved: true,
        message: "Producto guardado en wishlist.",
      };
    } catch (error) {
      return {
        ok: false,
        saved: Boolean(savedItem),
        message: getErrorMessage(error),
      };
    }
  }

  function toggleBook(book: Book) {
    return toggleItem({
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

  function toggleSaga(saga: Saga) {
    return toggleItem({
      id: `saga-${saga.id}`,
      type: "saga",
      productId: saga.id,
      title: saga.nombre,
      subtitle: `${saga.libros.length} libros incluidos`,
      image: saga.portada,
      price: saga.precioSaga,
      meta: "Paquete de saga",
    });
  }

  async function removeItem(itemId: string) {
    if (!isAuthenticated || !currentUser) return;

    try {
      const response = await removeWishlistItemRequest(Number(itemId));

      setItems(mapWishlistResponse(response));
    } catch {
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId),
      );
    }
  }

  async function clearWishlist() {
    if (!isAuthenticated || !currentUser) return;

    const currentItems = [...items];

    for (const item of currentItems) {
      await removeWishlistItemRequest(Number(item.id));
    }

    setItems([]);
  }

  const value: WishlistContextValue = {
    items,
    totalWishlistItems,
    addItem,
    toggleItem,
    toggleBook,
    toggleSaga,
    isItemSaved,
    isBookSaved,
    isSagaSaved,
    removeItem,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist debe usarse dentro de WishlistProvider.");
  }

  return context;
}