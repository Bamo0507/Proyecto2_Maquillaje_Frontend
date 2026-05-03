import { apiClient } from "@/lib/api/apiClient"

import type {
  AddReviewCommentBulkResponse,
  AddReviewCommentResponse,
  DeleteReviewCommentResponse,
  DeleteReviewCommentsBulkResponse,
  UpdateReviewRatingBulkResponse,
  UserReviewsResponse,
} from "./types"

export function getUserReviews(username: string) {
  return apiClient.get<UserReviewsResponse>(
    `/api/user/reviews/${encodeURIComponent(username)}`
  )
}

export function addReviewComment(
  username: string,
  productId: number,
  comment: string
) {
  return apiClient.patch<AddReviewCommentResponse>(
    `/api/user/reviews/${encodeURIComponent(username)}/${productId}/comment`,
    { comment }
  )
}

export function addReviewCommentBulk(
  username: string,
  productIds: number[],
  comment: string
) {
  return apiClient.patch<AddReviewCommentBulkResponse>(
    `/api/user/reviews/${encodeURIComponent(username)}/comments/bulk`,
    { productIds, comment }
  )
}

export function deleteReviewComment(username: string, productId: number) {
  return apiClient.delete<DeleteReviewCommentResponse>(
    `/api/user/reviews/${encodeURIComponent(username)}/${productId}/comment`
  )
}

export function deleteReviewCommentsBulk(username: string, productIds: number[]) {
  return apiClient.delete<DeleteReviewCommentsBulkResponse>(
    `/api/user/reviews/${encodeURIComponent(username)}/comments/bulk`,
    {
      body: JSON.stringify({ productIds }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

export function updateReviewRatingBulk(
  username: string,
  productIds: number[],
  rating: number
) {
  return apiClient.patch<UpdateReviewRatingBulkResponse>(
    `/api/user/reviews/${encodeURIComponent(username)}/rating/bulk`,
    { productIds, rating }
  )
}
