import { apiClient } from "@/lib/api/apiClient"

import type {
  AddProductToRoutineInput,
  AddProductToRoutineResponse,
  CategoriesResponse,
  CreateRoutineInput,
  CreateRoutineResponse,
  ProductsSearchResponse,
  UserRoutinesResponse,
} from "./types"

export function getUserRoutines(username: string): Promise<UserRoutinesResponse> {
  return apiClient.get<UserRoutinesResponse>(
    `/api/user/routines/${encodeURIComponent(username)}`
  )
}

export function createRoutine(
  username: string,
  input: CreateRoutineInput
): Promise<CreateRoutineResponse> {
  return apiClient.post<CreateRoutineResponse>(
    `/api/user/routines/${encodeURIComponent(username)}`,
    input
  )
}

export function addProductToRoutine(
  username: string,
  routineId: number,
  input: AddProductToRoutineInput
): Promise<AddProductToRoutineResponse> {
  return apiClient.post<AddProductToRoutineResponse>(
    `/api/user/routines/${encodeURIComponent(username)}/${routineId}/products`,
    input
  )
}

export function getProducts(params: {
  search?: string
  category?: string
}): Promise<ProductsSearchResponse> {
  const query = new URLSearchParams()

  if (params.search) {
    query.set("search", params.search)
  }

  if (params.category) {
    query.set("category", params.category)
  }

  const queryString = query.toString()
  return apiClient.get<ProductsSearchResponse>(
    `/api/products${queryString ? `?${queryString}` : ""}`
  )
}

export function getCategories(): Promise<CategoriesResponse> {
  return apiClient.get<CategoriesResponse>("/api/categories/")
}
