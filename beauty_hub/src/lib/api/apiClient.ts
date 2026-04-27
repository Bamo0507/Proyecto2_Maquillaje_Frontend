const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "API URL is not defined. Please check your environment variables (NEXT_PUBLIC_API_URL)."
  );
}

/**
 * Fetch API wrapper for the backend.
 * Adds base URL, handles JSON parsing, and throws on non-2xx responses.
 *
 * @param endpoint - e.g. '/dow-summary'
 * @param options - fetch options
 * @param onUnauthorized - optional callback to execute on 401
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  onUnauthorized?: () => void
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const requestOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, requestOptions);

    const jsonResponse = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401 && typeof onUnauthorized === "function") {
        onUnauthorized();
      }

      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (jsonResponse as any)?.message ||
        `Error ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = (jsonResponse as any)?.data ?? jsonResponse;

    if (payload === undefined) {
      return null as T;
    }

    return payload as T;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error desconocido"
    );
  }
}

/**
 * API client con métodos preconfigurados
 */
export const apiClient = {
  get: <T>(
    endpoint: string,
    options?: RequestInit,
    onUnauthorized?: () => void
  ): Promise<T> =>
    fetchApi<T>(endpoint, { ...options, method: "GET" }, onUnauthorized),

  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit,
    onUnauthorized?: () => void
  ): Promise<T> =>
    fetchApi<T>(
      endpoint,
      {
        ...options,
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      },
      onUnauthorized
    ),

  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit,
    onUnauthorized?: () => void
  ): Promise<T> =>
    fetchApi<T>(
      endpoint,
      {
        ...options,
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
      },
      onUnauthorized
    ),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit,
    onUnauthorized?: () => void
  ): Promise<T> =>
    fetchApi<T>(
      endpoint,
      {
        ...options,
        method: "PATCH",
        body: body ? JSON.stringify(body) : undefined,
      },
      onUnauthorized
    ),

  delete: <T>(
    endpoint: string,
    options?: RequestInit,
    onUnauthorized?: () => void
  ): Promise<T> =>
    fetchApi<T>(endpoint, { ...options, method: "DELETE" }, onUnauthorized),
};
