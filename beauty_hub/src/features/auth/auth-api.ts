import { apiClient } from "@/lib/api/apiClient";

import type { LoginInput, LoginResponse } from "./types";

export function loginUser(input: LoginInput): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>("/api/auth/login", input);
}
