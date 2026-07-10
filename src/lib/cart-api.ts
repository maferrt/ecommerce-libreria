import { apiFetch } from "@/lib/api";
import type { ApiCartResponse } from "@/lib/api-types";

export function getCartRequest() {
  return apiFetch<ApiCartResponse>("/api/cart", {
    method: "GET",
  });
}

export function addCartBookRequest(bookId: number) {
  return apiFetch<ApiCartResponse>(`/api/cart/books/${bookId}`, {
    method: "POST",
  });
}

export function addCartSagaRequest(sagaId: string) {
  return apiFetch<ApiCartResponse>(`/api/cart/sagas/${sagaId}`, {
    method: "POST",
  });
}

export function updateCartItemQuantityRequest(
  itemId: number,
  quantity: number,
) {
  return apiFetch<ApiCartResponse>(`/api/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItemRequest(itemId: number) {
  return apiFetch<ApiCartResponse>(`/api/cart/items/${itemId}`, {
    method: "DELETE",
  });
}

export function clearCartRequest() {
  return apiFetch<ApiCartResponse>("/api/cart", {
    method: "DELETE",
  });
}