export interface RecommendedProduct {
  productId: number
  name: string
  description: string
  price: number
  size?: string | null
  rating: number
  isVegan: boolean
  isCrueltyFree: boolean
  tags?: string[] | null
  finish?: string | null
  shade?: string | null
}

export interface SkinTypeRecommendation {
  skinType: string
  product: RecommendedProduct
  suitability: {
    efficacyScore: number
    dermatologistApproved: boolean
    notes?: string | null
  }
}

export interface SkinConcernRecommendation {
  skinConcern: string
  product: RecommendedProduct
  targeting: {
    efficacyScore: number
    clinicallyTested: boolean
    resultsTimeWeeks: number
  }
}

export interface RoutineRecommendation {
  routine: {
    routineId: number
    name: string
  }
  basedOnProduct: {
    productId: number
    name: string
  }
  product: RecommendedProduct
  similarity: {
    similarityScore: number
    reason?: string | null
    sharedIngredients: number
  }
}

export interface UserRecommendationsResponse<TRecommendation> {
  username: string
  total: number
  recommendations: TRecommendation[]
}
