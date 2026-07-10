import { apiFetch } from "@/lib/api";
import type {
  ApiCheckoutRequest,
  ApiOrderResponse,
} from "@/lib/api-types";

export function checkoutRequest(data: ApiCheckoutRequest) {
  return apiFetch<ApiOrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getOrdersRequest() {
  return apiFetch<ApiOrderResponse[]>("/api/orders", {
    method: "GET",
  });
}

export function getOrderByIdRequest(orderId: number) {
  return apiFetch<ApiOrderResponse>(`/api/orders/${orderId}`, {
    method: "GET",
  });
}