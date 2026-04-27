"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { useRecommendationsUsername } from "@/features/client/recommendations/hooks/useRecommendationsUsername"

import {
  deleteUserFavorite,
  deleteUserFavoritesBulk,
  getUserFavorites,
} from "../favorites-api"

export function useUserFavorites() {
  const queryClient = useQueryClient()
  const username = useRecommendationsUsername()

  const favoritesQuery = useQuery({
    queryKey: ["client", "favorites", username],
    queryFn: () => getUserFavorites(username),
    enabled: Boolean(username),
    staleTime: 2 * 60 * 1000,
  })

  const removeFavoriteMutation = useMutation({
    mutationFn: (productId: number) => deleteUserFavorite(username, productId),
    onSuccess: (data) => {
      toast.success(data.message || "Producto eliminado de favoritos")
      void queryClient.invalidateQueries({
        queryKey: ["client", "favorites", username],
      })
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo eliminar el favorito")
    },
  })

  const removeFavoritesBulkMutation = useMutation({
    mutationFn: (productIds: number[]) =>
      deleteUserFavoritesBulk(username, productIds),
    onSuccess: (data) => {
      toast.success(data.message || "Favoritos eliminados correctamente")
      void queryClient.invalidateQueries({
        queryKey: ["client", "favorites", username],
      })
    },
    onError: (error) => {
      toast.error(error.message || "No se pudieron eliminar los favoritos")
    },
  })

  return {
    username,
    favoritesQuery,
    favorites: favoritesQuery.data?.favorites ?? [],
    removeFavorite: removeFavoriteMutation.mutate,
    removeFavoritesBulk: removeFavoritesBulkMutation.mutate,
    removingProductId: removeFavoriteMutation.variables ?? null,
    isRemovingFavorite: removeFavoriteMutation.isPending,
    isRemovingFavoritesBulk: removeFavoritesBulkMutation.isPending,
  }
}
