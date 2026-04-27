export type TextListValue = string | string[] | null

export interface RoutineProduct {
  productId: number
  name: string
  brand: string | null
  price: number
  step: number
  notes: string | null
  mandatory: boolean
}

export interface UserRoutine {
  routineId: number
  name: string
  timeOfDay: string
  description: string | null
  skinFocus: string | null
  targetConcerns: TextListValue
  hasRoutine: {
    startedAt: string | null
    isActive: boolean
    frequency: string | null
  }
  products: RoutineProduct[]
}

export interface UserRoutinesResponse {
  username: string
  total: number
  routines: UserRoutine[]
}

export interface CreateRoutineInput {
  name: string
  timeOfDay: string
  description: string | null
  skinFocus: string | null
  targetConcerns: string[]
  hasRoutine: {
    isActive: boolean
    frequency: string | null
  }
}

export interface CreateRoutineResponse {
  message: string
  routineId: number
}

export interface AddProductToRoutineInput {
  productId: number
  step: number
  notes: string | null
  mandatory: boolean
}

export interface AddProductToRoutineResponse {
  message: string
  product: {
    productId: number
    name: string
    step: number
  }
}

export interface SearchProduct {
  productId: number
  name: string
  price: number
  brand: string | null
  categories: TextListValue
}

export interface ProductsSearchResponse {
  total: number
  products: SearchProduct[]
}

export interface Category {
  name: string
  description: string | null
  isForMakeup: boolean | null
  subcategories: TextListValue
}

export interface CategoriesResponse {
  total: number
  categories: Category[]
}
