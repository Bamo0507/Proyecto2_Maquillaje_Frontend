"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addUserFavorite, deleteUserFavorite } from "../products-api"
import type { AddUserFavoriteInput } from "../types"

export function useAddProductFavorite(productId: number, username: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AddUserFavoriteInput) =>
      addUserFavorite(username, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products", "detail", productId, username],
      })
    },
  })
}

export function useDeleteProductFavorite(productId: number, username: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteUserFavorite(username, productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products", "detail", productId, username],
      })
    },
  })
}
