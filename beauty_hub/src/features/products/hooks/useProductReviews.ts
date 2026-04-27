"use client"

import { useQuery } from "@tanstack/react-query"

import { getProductReviews } from "../products-api"

export function useProductReviews(productId: number, enabled = true) {
  return useQuery({
    queryKey: ["products", "reviews", productId],
    queryFn: () => getProductReviews(productId),
    staleTime: 2 * 60 * 1000,
    enabled,
  })
}
