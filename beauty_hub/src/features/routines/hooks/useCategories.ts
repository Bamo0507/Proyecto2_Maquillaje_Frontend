"use client"

import { useQuery } from "@tanstack/react-query"

import { getCategories } from "../routines-api"

export function useCategories() {
  return useQuery({
    queryKey: ["categories", "list"],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  })
}
