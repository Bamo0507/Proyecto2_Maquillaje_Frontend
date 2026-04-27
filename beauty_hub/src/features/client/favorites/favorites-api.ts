import { apiClient } from "@/lib/api/apiClient"

import type {
  DeleteUserFavoritesBulkResponse,
  DeleteUserFavoriteResponse,
  UserFavoritesResponse,
} from "./types"

export function getUserFavorites(userId: string) {
  return apiClient.get<UserFavoritesResponse>(
    `/api/users/${encodeURIComponent(userId)}/favorites`
  )
}

export function deleteUserFavorite(userId: string, productId: number) {
  return apiClient.delete<DeleteUserFavoriteResponse>(
    `/api/users/${encodeURIComponent(userId)}/favorites/${productId}`
  )
}

export function deleteUserFavoritesBulk(userId: string, productIds: number[]) {
  return apiClient.delete<DeleteUserFavoritesBulkResponse>(
    `/api/users/${encodeURIComponent(userId)}/favorites/bulk`,
    {
      body: JSON.stringify({ productIds }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}
