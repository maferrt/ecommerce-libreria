import { getAuthToken } from "@/lib/auth-storage";

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

type ApiErrorResponse = {
  message?: string;
  timestamp?: string;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8080";

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${API_BASE_URL}${normalizedPath}`;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  return response.json();
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { auth = true, headers, body, ...restOptions } = options;

  const requestHeaders = new Headers(headers);

  if (body && !(body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAuthToken();

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(buildApiUrl(path), {
    ...restOptions,
    headers: requestHeaders,
    body,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null;

    throw new ApiError(
      errorData?.message ?? "Ocurrió un error al conectar con el servidor.",
      response.status,
      data,
    );
  }

  return data as T;
}