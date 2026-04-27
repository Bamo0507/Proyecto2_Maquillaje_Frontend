import { apiClient } from "@/lib/api/apiClient"

import type {
  BudgetProductsResponse,
  TopRankedProductsResponse,
} from "./types"

export function getTopRankedProducts() {
  return apiClient.get<TopRankedProductsResponse>(
    "/api/recommendations/top-ranked"
  )
}

export function getProductsByBudget(username: string) {
  return apiClient.get<BudgetProductsResponse>(
    `/api/products/budget/${encodeURIComponent(username)}`
  )
}
