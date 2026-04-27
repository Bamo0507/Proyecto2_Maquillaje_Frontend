import { apiClient } from "@/lib/api/apiClient"

import type {
  CreateProductReviewInput,
  CreateProductReviewResponse,
  ProductDetailResponse,
  ProductReviewsResponse,
  SimilarProductsResponse,
} from "./types"

export function getProductById(productId: number): Promise<ProductDetailResponse> {
  return apiClient.get<ProductDetailResponse>(`/api/products/${productId}`)
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
