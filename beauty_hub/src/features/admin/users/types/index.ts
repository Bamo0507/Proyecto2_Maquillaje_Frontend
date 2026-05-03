export type AdminUserRole = "admin" | "user"

export type TextListValue = string | string[] | null

export interface AdminUser {
  username: string
  email: string
  isPremium: boolean
  role: AdminUserRole
  age: number | null
  country: string | null
  preferences: TextListValue
  monthlyBudget: number | null
}

export interface GetUsersResponse {
  total: number
  users: AdminUser[]
}

export interface CreateUserInput {
  username: string
  email: string
  password: string
  age: number | null
  country: string | null
  preferences: string[]
  monthlyBudget: number | null
  isPremium: boolean
  isAdmin: boolean
}

export interface UpdateUserInput {
  email?: string | null
  password?: string | null
  age?: number | null
  country?: string | null
  preferences?: string[] | null
  monthlyBudget?: number | null
  isPremium?: boolean
}

export interface UserMutationResponse {
  message: string
  user: AdminUser
}

export interface BulkUsernamesInput {
  usernames: string[]
}

export interface BulkPremiumInput extends BulkUsernamesInput {
  isPremium: boolean
}

export interface BulkBudgetInput extends BulkUsernamesInput {
  monthlyBudget: number
}

export interface BulkMutationResponse {
  message: string
  requested: number
  updated?: number
  deleted?: number
  usernames: string[]
}

export interface DeleteUserResponse {
  message: string
  username: string
}

export interface DeleteBudgetResponse {
  message: string
}
