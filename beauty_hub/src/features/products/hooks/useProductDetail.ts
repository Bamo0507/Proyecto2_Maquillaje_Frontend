"use client"

import { useQuery } from "@tanstack/react-query"

import { getProductById } from "../products-api"

export function useProductDetail(
  productId: number,
  username: string,
  enabled = true
) {
  return useQuery({
    queryKey: ["products", "detail", productId, username],
    queryFn: () => getProductById(productId, username),
    staleTime: 5 * 60 * 1000,
    enabled,
  })
}
