export interface PremiumProduct {
  productId: number
  name: string
  price: number
  rating: number
  size?: string | null
  isVegan?: boolean | null
  isCrueltyFree?: boolean | null
  finish?: string | null
  shade?: string | null
  brand?: string | null
  brandName?: string | null
  pageRankScore?: number | null
}

export interface TopRankedProductsResponse {
  total: number
  products: PremiumProduct[]
}

export interface BudgetProductsResponse {
  username: string
  budget: number | null
  total: number
  products: PremiumProduct[]
}
