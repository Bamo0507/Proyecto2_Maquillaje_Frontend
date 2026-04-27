"use client"

import { useQuery } from "@tanstack/react-query"

import { getProducts } from "../routines-api"

export function useProductsSearch(params: {
  search: string
  category: string
}) {
  return useQuery({
    queryKey: ["products", "search", params],
    queryFn: () =>
      getProducts({
        search: params.search.trim() || undefined,
        category: params.category || undefined,
      }),
    staleTime: 60 * 1000,
  })
}
