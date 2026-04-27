export type TextListValue = string | string[] | null

export interface ProfileUser {
  username: string
  email: string | null
  isPremium: boolean
  age: number | null
  country: string | null
  preferences: TextListValue
  monthlyBudget: number | null
}

export interface UserSkinType {
  name: string
  description: string | null
  characteristics: TextListValue
  recommendedRoutine: TextListValue
  avoidIngredients: TextListValue
  confirmedAt: string | null
  selfDiagnosed: boolean | null
  sensitivity: string | null
  area: string | null
}

export interface UserConcern {
  name: string
  description: string | null
  triggers: TextListValue
  recommendedIngredients: TextListValue
  severity: number | null
  isPrimary: boolean | null
  since: string | null
}

export interface UserProfileStats {
  totalReviews: number
  averageRating: number
  totalFavorites: number
  totalRoutines: number
}

export interface UserProfileResponse {
  user: ProfileUser
  skinTypes: UserSkinType[]
  concerns: UserConcern[]
  stats: UserProfileStats
}

export interface UpdateUserProfileInput {
  age: number | null
  country: string | null
  preferences: string[] | null
  monthlyBudget: number | null
}

export interface UpdateUserProfileResponse {
  message: string
  user: Pick<
    ProfileUser,
    "username" | "age" | "country" | "preferences" | "monthlyBudget"
  >
}

export interface AvailableSkinTypesResponse {
  username: string
  total: number
  skinTypes: Array<
    Pick<
      UserSkinType,
      | "name"
      | "description"
      | "characteristics"
      | "recommendedRoutine"
      | "avoidIngredients"
    >
  >
}

export interface AvailableConcernsResponse {
  username: string
  total: number
  concerns: Array<
    Pick<UserConcern, "name" | "description" | "triggers" | "recommendedIngredients">
  >
}

export interface SkinTypeRelationInput {
  skinTypeName: string
  confirmedAt: string | null
  selfDiagnosed: boolean
  sensitivity: string | null
  area: string | null
}

export interface ConcernRelationInput {
  concernName: string
  severity: number
  isPrimary: boolean
  since: string | null
}

export interface ProfileMutationResponse {
  message: string
}
