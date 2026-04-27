import { apiClient } from "@/lib/api/apiClient"

import type {
  AvailableConcernsResponse,
  AvailableSkinTypesResponse,
  ConcernRelationInput,
  ProfileMutationResponse,
  SkinTypeRelationInput,
  UpdateUserProfileInput,
  UpdateUserProfileResponse,
  UserProfileResponse,
} from "./types"

const profilePath = (username: string) =>
  `/api/user/profile/${encodeURIComponent(username)}`

export function getUserProfile(username: string): Promise<UserProfileResponse> {
  return apiClient.get<UserProfileResponse>(profilePath(username))
}

export function updateUserProfile(
  username: string,
  input: UpdateUserProfileInput
): Promise<UpdateUserProfileResponse> {
  return apiClient.patch<UpdateUserProfileResponse>(profilePath(username), input)
}

export function deleteMonthlyBudget(
  username: string
): Promise<ProfileMutationResponse> {
  return apiClient.delete<ProfileMutationResponse>(
    `${profilePath(username)}/monthly-budget`
  )
}

export function getAvailableSkinTypes(
  username: string
): Promise<AvailableSkinTypesResponse> {
  return apiClient.get<AvailableSkinTypesResponse>(
    `${profilePath(username)}/available-skin-types`
  )
}

export function getAvailableConcerns(
  username: string
): Promise<AvailableConcernsResponse> {
  return apiClient.get<AvailableConcernsResponse>(
    `${profilePath(username)}/available-concerns`
  )
}

export function addUserSkinType(
  username: string,
  input: SkinTypeRelationInput
): Promise<ProfileMutationResponse> {
  return apiClient.post<ProfileMutationResponse>(
    `${profilePath(username)}/skin-types`,
    input
  )
}

export function updateUserSkinType(
  username: string,
  input: SkinTypeRelationInput
): Promise<ProfileMutationResponse> {
  return apiClient.patch<ProfileMutationResponse>(
    `${profilePath(username)}/skin-types/${encodeURIComponent(input.skinTypeName)}`,
    input
  )
}

export function deleteUserSkinType(
  username: string,
  skinTypeName: string
): Promise<ProfileMutationResponse> {
  return apiClient.delete<ProfileMutationResponse>(
    `${profilePath(username)}/skin-types/${encodeURIComponent(skinTypeName)}`
  )
}

export function addUserConcern(
  username: string,
  input: ConcernRelationInput
): Promise<ProfileMutationResponse> {
  return apiClient.post<ProfileMutationResponse>(
    `${profilePath(username)}/concerns`,
    input
  )
}

export function updateUserConcern(
  username: string,
  input: ConcernRelationInput
): Promise<ProfileMutationResponse> {
  return apiClient.patch<ProfileMutationResponse>(
    `${profilePath(username)}/concerns/${encodeURIComponent(input.concernName)}`,
    input
  )
}

export function deleteUserConcern(
  username: string,
  concernName: string
): Promise<ProfileMutationResponse> {
  return apiClient.delete<ProfileMutationResponse>(
    `${profilePath(username)}/concerns/${encodeURIComponent(concernName)}`
  )
}
