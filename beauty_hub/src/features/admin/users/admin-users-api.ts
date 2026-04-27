import { apiClient } from "@/lib/api/apiClient"

import type {
  BulkBudgetInput,
  BulkMutationResponse,
  BulkPremiumInput,
  BulkUsernamesInput,
  CreateUserInput,
  DeleteBudgetResponse,
  DeleteUserResponse,
  GetUsersResponse,
  UpdateUserInput,
  UserMutationResponse,
} from "./types"

const ADMIN_USERS_PATH = "/api/admin/users"

export function getAdminUsers(): Promise<GetUsersResponse> {
  return apiClient.get<GetUsersResponse>(ADMIN_USERS_PATH)
}

export function createAdminUser(
  input: CreateUserInput
): Promise<UserMutationResponse> {
  return apiClient.post<UserMutationResponse>(ADMIN_USERS_PATH, input)
}

export function updateAdminUser(
  username: string,
  input: UpdateUserInput
): Promise<UserMutationResponse> {
  return apiClient.patch<UserMutationResponse>(
    `${ADMIN_USERS_PATH}/${encodeURIComponent(username)}`,
    input
  )
}

export function updateAdminUsersPremium(
  input: BulkPremiumInput
): Promise<BulkMutationResponse> {
  return apiClient.patch<BulkMutationResponse>(
    `${ADMIN_USERS_PATH}/bulk/premium`,
    input
  )
}

export function updateAdminUsersMonthlyBudget(
  input: BulkBudgetInput
): Promise<BulkMutationResponse> {
  return apiClient.patch<BulkMutationResponse>(
    `${ADMIN_USERS_PATH}/bulk/monthly-budget`,
    input
  )
}

export function deleteAdminUser(username: string): Promise<DeleteUserResponse> {
  return apiClient.delete<DeleteUserResponse>(
    `${ADMIN_USERS_PATH}/${encodeURIComponent(username)}`
  )
}

export function deleteAdminUsersBulk(
  input: BulkUsernamesInput
): Promise<BulkMutationResponse> {
  return apiClient.delete<BulkMutationResponse>(`${ADMIN_USERS_PATH}/bulk`, {
    body: JSON.stringify(input),
  })
}

export function deleteAdminUserMonthlyBudget(
  username: string
): Promise<DeleteBudgetResponse> {
  return apiClient.delete<DeleteBudgetResponse>(
    `${ADMIN_USERS_PATH}/${encodeURIComponent(username)}/monthly-budget`
  )
}

export function deleteAdminUsersMonthlyBudget(
  input: BulkUsernamesInput
): Promise<BulkMutationResponse> {
  return apiClient.delete<BulkMutationResponse>(
    `${ADMIN_USERS_PATH}/bulk/monthly-budget`,
    {
      body: JSON.stringify(input),
    }
  )
}
