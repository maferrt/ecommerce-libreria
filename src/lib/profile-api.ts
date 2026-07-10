import { apiFetch } from "@/lib/api";
import type { ApiProfile, ApiProfileUpdateRequest } from "@/lib/api-types";

export function getProfileRequest() {
  return apiFetch<ApiProfile>("/api/profile", {
    method: "GET",
  });
}

export function updateProfileRequest(data: ApiProfileUpdateRequest) {
  return apiFetch<ApiProfile>("/api/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}