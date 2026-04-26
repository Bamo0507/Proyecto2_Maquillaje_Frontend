import { apiClient } from "@/lib/api/apiClient"

import type {
  RoutineRecommendation,
  SkinConcernRecommendation,
  SkinTypeRecommendation,
  UserRecommendationsResponse,
} from "./types"

export function getRecommendationsBySkinType(username: string) {
  return apiClient.get<UserRecommendationsResponse<SkinTypeRecommendation>>(
    `/api/recommendations/skin-type/${encodeURIComponent(username)}`
  )
}

export function getRecommendationsBySkinConcern(username: string) {
  return apiClient.get<UserRecommendationsResponse<SkinConcernRecommendation>>(
    `/api/recommendations/skin-concern/${encodeURIComponent(username)}`
  )
}

export function getRoutineRecommendations(username: string) {
  return apiClient.get<UserRecommendationsResponse<RoutineRecommendation>>(
    `/api/recommendations/routine/${encodeURIComponent(username)}`
  )
}
