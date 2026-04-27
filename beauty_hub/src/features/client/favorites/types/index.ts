export interface FavoriteProduct {
  productId: number
  name: string
  description?: string | null
  price: number
  size?: string | null
  rating: number
  isVegan?: boolean | null
  isCrueltyFree?: boolean | null
  tags?: string[] | null
  finish?: string | null
  shade?: string | null
  brand?: string | null
}

export interface FavoriteMetadata {
  addedAt?: string | null
  notes?: string | null
  isPurchased?: boolean | null
}

export interface UserFavorite {
  product: FavoriteProduct
  favorite: FavoriteMetadata
}

export interface UserFavoritesResponse {
  userId: string
  total: number
  favorites: UserFavorite[]
}

export interface DeleteUserFavoriteResponse {
  message: string
  userId: string
  product: {
    productId: number
    name: string
  }
}

export interface DeleteUserFavoritesBulkResponse {
  message: string
  userId: string
  requested: number
  deleted: number
  favorites: Array<{
    productId: number
    productName: string
  }>
}
