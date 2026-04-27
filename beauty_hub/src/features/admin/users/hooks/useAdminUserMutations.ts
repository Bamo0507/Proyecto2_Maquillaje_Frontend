"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  createAdminUser,
  deleteAdminUser,
  deleteAdminUserMonthlyBudget,
  deleteAdminUsersBulk,
  deleteAdminUsersMonthlyBudget,
  updateAdminUser,
  updateAdminUsersMonthlyBudget,
  updateAdminUsersPremium,
} from "../admin-users-api"
import type {
  BulkBudgetInput,
  BulkPremiumInput,
  BulkUsernamesInput,
  CreateUserInput,
  UpdateUserInput,
} from "../types"

function useInvalidateAdminUsers() {
  const queryClient = useQueryClient()

  return () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
}

export function useCreateAdminUser() {
  const invalidateUsers = useInvalidateAdminUsers()

  return useMutation({
    mutationFn: (input: CreateUserInput) => createAdminUser(input),
    onSuccess: invalidateUsers,
  })
}

export function useUpdateAdminUser() {
  const invalidateUsers = useInvalidateAdminUsers()

  return useMutation({
    mutationFn: ({
      username,
      input,
    }: {
      username: string
      input: UpdateUserInput
    }) => updateAdminUser(username, input),
    onSuccess: invalidateUsers,
  })
}

export function useUpdateAdminUsersPremium() {
  const invalidateUsers = useInvalidateAdminUsers()

  return useMutation({
    mutationFn: (input: BulkPremiumInput) => updateAdminUsersPremium(input),
    onSuccess: invalidateUsers,
  })
}

export function useUpdateAdminUsersMonthlyBudget() {
  const invalidateUsers = useInvalidateAdminUsers()

  return useMutation({
    mutationFn: (input: BulkBudgetInput) => updateAdminUsersMonthlyBudget(input),
    onSuccess: invalidateUsers,
  })
}

export function useDeleteAdminUser() {
  const invalidateUsers = useInvalidateAdminUsers()

  return useMutation({
    mutationFn: (username: string) => deleteAdminUser(username),
    onSuccess: invalidateUsers,
  })
}

export function useDeleteAdminUsersBulk() {
  const invalidateUsers = useInvalidateAdminUsers()

  return useMutation({
    mutationFn: (input: BulkUsernamesInput) => deleteAdminUsersBulk(input),
    onSuccess: invalidateUsers,
  })
}

export function useDeleteAdminUserMonthlyBudget() {
  const invalidateUsers = useInvalidateAdminUsers()

  return useMutation({
    mutationFn: (username: string) => deleteAdminUserMonthlyBudget(username),
    onSuccess: invalidateUsers,
  })
}

export function useDeleteAdminUsersMonthlyBudget() {
  const invalidateUsers = useInvalidateAdminUsers()

  return useMutation({
    mutationFn: (input: BulkUsernamesInput) =>
      deleteAdminUsersMonthlyBudget(input),
    onSuccess: invalidateUsers,
  })
}
