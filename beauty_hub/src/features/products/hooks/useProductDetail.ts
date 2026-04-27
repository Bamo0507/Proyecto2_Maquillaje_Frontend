"use client"

import { useQuery } from "@tanstack/react-query"

import { getProductById } from "../products-api"

export function useProductDetail(productId: number, enabled = true) {
  return useQuery({
    queryKey: ["products", "detail", productId],
    queryFn: () => getProductById(productId),
    staleTime: 5 * 60 * 1000,
    enabled,
  })
}
