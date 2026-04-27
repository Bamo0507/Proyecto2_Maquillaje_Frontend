"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  addUserConcern,
  addUserSkinType,
  deleteMonthlyBudget,
  deleteUserConcern,
  deleteUserSkinType,
  updateUserConcern,
  updateUserProfile,
  updateUserSkinType,
} from "../profile-api"
import type {
  ConcernRelationInput,
  SkinTypeRelationInput,
  UpdateUserProfileInput,
} from "../types"

function useInvalidateProfile(username: string) {
  const queryClient = useQueryClient()

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["profile", username] }),
      queryClient.invalidateQueries({
        queryKey: ["profile", username, "available-skin-types"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["profile", username, "available-concerns"],
      }),
    ])
  }
}

export function useUpdateProfile(username: string) {
  const invalidateProfile = useInvalidateProfile(username)

  return useMutation({
    mutationFn: (input: UpdateUserProfileInput) =>
      updateUserProfile(username, input),
    onSuccess: invalidateProfile,
  })
}

export function useDeleteMonthlyBudget(username: string) {
  const invalidateProfile = useInvalidateProfile(username)

  return useMutation({
    mutationFn: () => deleteMonthlyBudget(username),
    onSuccess: invalidateProfile,
  })
}

export function useAddSkinType(username: string) {
  const invalidateProfile = useInvalidateProfile(username)

  return useMutation({
    mutationFn: (input: SkinTypeRelationInput) => addUserSkinType(username, input),
    onSuccess: invalidateProfile,
  })
}

export function useUpdateSkinType(username: string) {
  const invalidateProfile = useInvalidateProfile(username)

  return useMutation({
    mutationFn: (input: SkinTypeRelationInput) =>
      updateUserSkinType(username, input),
    onSuccess: invalidateProfile,
  })
}

export function useDeleteSkinType(username: string) {
  const invalidateProfile = useInvalidateProfile(username)

  return useMutation({
    mutationFn: (skinTypeName: string) => deleteUserSkinType(username, skinTypeName),
    onSuccess: invalidateProfile,
  })
}

export function useAddConcern(username: string) {
  const invalidateProfile = useInvalidateProfile(username)

  return useMutation({
    mutationFn: (input: ConcernRelationInput) => addUserConcern(username, input),
    onSuccess: invalidateProfile,
  })
}

export function useUpdateConcern(username: string) {
  const invalidateProfile = useInvalidateProfile(username)

  return useMutation({
    mutationFn: (input: ConcernRelationInput) => updateUserConcern(username, input),
    onSuccess: invalidateProfile,
  })
}

export function useDeleteConcern(username: string) {
  const invalidateProfile = useInvalidateProfile(username)

  return useMutation({
    mutationFn: (concernName: string) => deleteUserConcern(username, concernName),
    onSuccess: invalidateProfile,
  })
}
