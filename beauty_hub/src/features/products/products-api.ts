import { apiClient } from "@/lib/api/apiClient"

import type {
  AddUserFavoriteInput,
  AddUserFavoriteResponse,
  CreateProductReviewInput,
  CreateProductReviewResponse,
  DeleteUserFavoriteResponse,
  ProductDetailResponse,
  ProductReviewsResponse,
  SimilarProductsResponse,
} from "./types"

export function getProductById(
  productId: number,
  username?: string
): Promise<ProductDetailResponse> {
  const query = new URLSearchParams()

  if (username) {
    query.set("username", username)
  }

  const queryString = query.toString()

  return apiClient.get<ProductDetailResponse>(
    `/api/products/${productId}${queryString ? `?${queryString}` : ""}`
  )
}

export function getProductReviews(
  productId: number
): Promise<ProductReviewsResponse> {
  return apiClient.get<ProductReviewsResponse>(`/api/products/${productId}/reviews`)
}

export function getSimilarProducts(
  productId: number
): Promise<SimilarProductsResponse> {
  return apiClient.get<SimilarProductsResponse>(`/api/products/${productId}/similar`)
}

export function createProductReview(
  productId: number,
  input: CreateProductReviewInput
): Promise<CreateProductReviewResponse> {
  return apiClient.post<CreateProductReviewResponse>(
    `/api/products/${productId}/reviews`,
    input
  )
}

export function addUserFavorite(
  userId: string,
  input: AddUserFavoriteInput
): Promise<AddUserFavoriteResponse> {
  return apiClient.post<AddUserFavoriteResponse>(
    `/api/users/${encodeURIComponent(userId)}/favorites`,
    input
  )
}

export function deleteUserFavorite(
  userId: string,
  productId: number
): Promise<DeleteUserFavoriteResponse> {
  return apiClient.delete<DeleteUserFavoriteResponse>(
    `/api/users/${encodeURIComponent(userId)}/favorites/${productId}`
  )
}
