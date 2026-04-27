"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createProductReview } from "../products-api"
import type { CreateProductReviewInput } from "../types"

export function useCreateProductReview(productId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateProductReviewInput) =>
      createProductReview(productId, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["products", "detail", productId] }),
        queryClient.invalidateQueries({ queryKey: ["products", "reviews", productId] }),
      ])
    },
  })
}
