import { apiFetch } from "@/lib/api";
import type {
  ApiAuthResponse,
  ApiLoginRequest,
  ApiRegisterRequest,
} from "@/lib/api-types";

export function registerRequest(data: ApiRegisterRequest) {
  return apiFetch<ApiAuthResponse>("/api/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify(data),
  });
}

export function loginRequest(data: ApiLoginRequest) {
  return apiFetch<ApiAuthResponse>("/api/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(data),
  });
}

export function getCurrentUserRequest() {
  return apiFetch<ApiAuthResponse["user"]>("/api/auth/me", {
    method: "GET",
  });
}