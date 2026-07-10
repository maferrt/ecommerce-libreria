import { apiFetch } from "@/lib/api";
import type { ApiWishlistResponse } from "@/lib/api-types";

export function getWishlistRequest() {
  return apiFetch<ApiWishlistResponse>("/api/wishlist", {
    method: "GET",
  });
}

export function addWishlistBookRequest(bookId: number) {
  return apiFetch<ApiWishlistResponse>(`/api/wishlist/books/${bookId}`, {
    method: "POST",
  });
}

export function addWishlistSagaRequest(sagaId: string) {
  return apiFetch<ApiWishlistResponse>(`/api/wishlist/sagas/${sagaId}`, {
    method: "POST",
  });
}

export function removeWishlistItemRequest(itemId: number) {
  return apiFetch<ApiWishlistResponse>(`/api/wishlist/items/${itemId}`, {
    method: "DELETE",
  });
}