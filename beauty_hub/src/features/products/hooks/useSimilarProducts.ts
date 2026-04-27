"use client"

import { useQuery } from "@tanstack/react-query"

import { getSimilarProducts } from "../products-api"

export function useSimilarProducts(productId: number, enabled = true) {
  return useQuery({
    queryKey: ["products", "similar", productId],
    queryFn: () => getSimilarProducts(productId),
    staleTime: 5 * 60 * 1000,
    enabled,
  })
}
