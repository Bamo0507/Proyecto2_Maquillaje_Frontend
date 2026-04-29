export interface ReviewProduct {
  productId: number
  name: string
  brand?: string | null
}

export interface UserReview {
  rating: number
  comment?: string | null
  reviewDate?: string | null
  wouldRecommend?: boolean | null
  product: ReviewProduct
}

export interface UserReviewsResponse {
  username: string
  total: number
  reviews: UserReview[]
}

export interface AddReviewCommentResponse {
  message: string
  review: UserReview
}

export interface AddReviewCommentBulkResponse {
  message: string
  username: string
  requested: number
  updated: number
  reviews: UserReview[]
}

export interface DeleteReviewCommentResponse {
  message: string
  updated: {
    productId: number
    productName: string
  }
}

export interface DeleteReviewCommentsBulkResponse {
  message: string
  username: string
  requested: number
  updated: number
  reviews: Array<{
    productId: number
    productName: string
  }>
}
