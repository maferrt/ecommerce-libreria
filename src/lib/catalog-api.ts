import { apiFetch } from "@/lib/api";
import type { BookCategory, CatalogData } from "@/types/book";

export type ApiCategoryResponse = {
  id: BookCategory;
  label: string;
};

export function getCatalogRequest() {
  return apiFetch<CatalogData>("/api/catalog", {
    method: "GET",
    auth: false,
  });
}

export function getCategoriesRequest() {
  return apiFetch<ApiCategoryResponse[]>("/api/categories", {
    method: "GET",
    auth: false,
  });
}