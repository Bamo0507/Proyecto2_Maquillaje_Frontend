export type TextListValue = string | string[] | null

export interface Product {
  productId: number
  name: string
  description: string
  price: number
  size?: string | null
  rating: number
  isVegan: boolean
  isCrueltyFree: boolean
  tags?: TextListValue
  launchDate?: string | null
  finish?: string | null
  shade?: string | null
  pageRankScore?: number | null
}

export interface ProductBrand {
  name: string
  country?: string | null
  foundedYear?: number | null
  isLuxury?: boolean | null
  certifications?: TextListValue
  description?: string | null
}

export interface ProductCategory {
  name: string
  description?: string | null
}

export interface ProductIngredient {
  name: string
  concentration?: string | null
  benefits?: TextListValue
  warnings?: TextListValue
  phOptimal?: string | null
  relationship: {
    percentage?: number | null
    position: number
    isKeyIngredient: boolean
    purpose?: string | null
  }
}

export interface ProductSkinType {
  name: string
  description?: string | null
  characteristics?: TextListValue
  recommendedRoutine?: TextListValue
  avoidIngredients?: TextListValue
  relationship: {
    efficacyScore?: number | null
    dermatologistApproved?: boolean | null
    notes?: string | null
  }
}

export interface ProductSkinConcern {
  name: string
  description?: string | null
  triggers?: TextListValue
  recommendedIngredients?: TextListValue
  relationship: {
    efficacyScore?: number | null
    clinicallyTested?: boolean | null
    resultsTimeWeeks?: number | null
  }
}

export interface ProductDetailResponse {
  product: Product
  brand: ProductBrand | null
  categories: ProductCategory[]
  ingredients: ProductIngredient[]
  skinTypes: ProductSkinType[]
  skinConcerns: ProductSkinConcern[]
}

export interface ProductReview {
  username: string
  rating: number
  comment: string | null
  reviewDate: string | null
  wouldRecommend?: boolean | null
}

export interface ProductReviewsResponse {
  total: number
  reviews: ProductReview[]
}

export interface SimilarProduct {
  productId: number
  name: string
  price: number
  brand: string | null
}

export interface SimilarProductsResponse {
  total: number
  products: SimilarProduct[]
}

export interface CreateProductReviewInput {
  username: string
  rating: number
  comment: string | null
  wouldRecommend: boolean
}

export interface CreateProductReviewResponse {
  message: string
  review: {
    username: string
    rating: number
    comment: string | null
    reviewDate: string | null
    wouldRecommend: boolean
  }
}
