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
import type { Book, Saga } from "@/types/book";
import type {
  AddWishlistItemInput,
  WishlistItem,
} from "@/types/wishlist";

const WISHLIST_STORAGE_KEY = "mel_wishlist_items";

type StoredWishlistItems = Record<string, WishlistItem[]>;

export type WishlistToggleResult = {
  ok: boolean;
  saved: boolean;
  message: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  totalWishlistItems: number;
  addItem: (item: AddWishlistItemInput) => WishlistToggleResult;
  toggleItem: (item: AddWishlistItemInput) => WishlistToggleResult;
  toggleBook: (book: Book) => WishlistToggleResult;
  toggleSaga: (saga: Saga) => WishlistToggleResult;
  isItemSaved: (itemId: string) => boolean;
  isBookSaved: (bookId: number) => boolean;
  isSagaSaved: (sagaId: string) => boolean;
  removeItem: (itemId: string) => void;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

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

function getStoredWishlistItems() {
  return safeReadJson<StoredWishlistItems>(WISHLIST_STORAGE_KEY, {});
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAccount();
  const [storedItems, setStoredItems] = useState<StoredWishlistItems>({});
  const [hasLoadedWishlist, setHasLoadedWishlist] = useState(false);

  useEffect(() => {
    setStoredItems(getStoredWishlistItems());
    setHasLoadedWishlist(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedWishlist) return;

    saveJson(WISHLIST_STORAGE_KEY, storedItems);
  }, [storedItems, hasLoadedWishlist]);

  const items = useMemo(() => {
    if (!currentUser) return [];

    return storedItems[currentUser.id] ?? [];
  }, [currentUser, storedItems]);

  const totalWishlistItems = items.length;

  function getCurrentUserItems() {
    if (!currentUser) return [];

    return storedItems[currentUser.id] ?? [];
  }

  function isItemSaved(itemId: string) {
    return items.some((item) => item.id === itemId);
  }

  function isBookSaved(bookId: number) {
    return isItemSaved(`book-${bookId}`);
  }

  function isSagaSaved(sagaId: string) {
    return isItemSaved(`saga-${sagaId}`);
  }

  function addItem(item: AddWishlistItemInput): WishlistToggleResult {
    if (!currentUser) {
      return {
        ok: false,
        saved: false,
        message: "Inicia sesión para guardar favoritos.",
      };
    }

    const currentItems = getCurrentUserItems();
    const alreadySaved = currentItems.some(
      (wishlistItem) => wishlistItem.id === item.id,
    );

    if (alreadySaved) {
      return {
        ok: true,
        saved: true,
        message: "Este producto ya estaba en tu wishlist.",
      };
    }

    const newItem: WishlistItem = {
      ...item,
      createdAt: new Date().toISOString(),
    };

    setStoredItems((currentStoredItems) => ({
      ...currentStoredItems,
      [currentUser.id]: [...currentItems, newItem],
    }));

    return {
      ok: true,
      saved: true,
      message: "Producto guardado en wishlist.",
    };
  }

  function toggleItem(item: AddWishlistItemInput): WishlistToggleResult {
    if (!currentUser) {
      return {
        ok: false,
        saved: false,
        message: "Inicia sesión para guardar favoritos.",
      };
    }

    const currentItems = getCurrentUserItems();
    const alreadySaved = currentItems.some(
      (wishlistItem) => wishlistItem.id === item.id,
    );

    if (alreadySaved) {
      setStoredItems((currentStoredItems) => ({
        ...currentStoredItems,
        [currentUser.id]: currentItems.filter(
          (wishlistItem) => wishlistItem.id !== item.id,
        ),
      }));

      return {
        ok: true,
        saved: false,
        message: "Producto eliminado de wishlist.",
      };
    }

    const newItem: WishlistItem = {
      ...item,
      createdAt: new Date().toISOString(),
    };

    setStoredItems((currentStoredItems) => ({
      ...currentStoredItems,
      [currentUser.id]: [...currentItems, newItem],
    }));

    return {
      ok: true,
      saved: true,
      message: "Producto guardado en wishlist.",
    };
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

  function removeItem(itemId: string) {
    if (!currentUser) return;

    const currentItems = getCurrentUserItems();

    setStoredItems((currentStoredItems) => ({
      ...currentStoredItems,
      [currentUser.id]: currentItems.filter((item) => item.id !== itemId),
    }));
  }

  function clearWishlist() {
    if (!currentUser) return;

    setStoredItems((currentStoredItems) => ({
      ...currentStoredItems,
      [currentUser.id]: [],
    }));
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