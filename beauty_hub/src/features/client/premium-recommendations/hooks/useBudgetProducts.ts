"use client"

import { useQuery } from "@tanstack/react-query"

import { getProductsByBudget } from "../premium-recommendations-api"

export function useBudgetProducts(username: string) {
  return useQuery({
    queryKey: ["client", "premium-recommendations", "budget", username],
    queryFn: () => getProductsByBudget(username),
    enabled: Boolean(username),
    staleTime: 5 * 60 * 1000,
  })
}
