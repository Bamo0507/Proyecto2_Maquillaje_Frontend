"use client"

import { useQuery } from "@tanstack/react-query"

import { getTopRankedProducts } from "../premium-recommendations-api"

export function useTopRankedProducts() {
  return useQuery({
    queryKey: ["client", "premium-recommendations", "top-ranked"],
    queryFn: getTopRankedProducts,
    staleTime: 5 * 60 * 1000,
  })
}
