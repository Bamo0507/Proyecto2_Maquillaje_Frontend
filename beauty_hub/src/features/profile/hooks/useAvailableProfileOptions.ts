"use client"

import { useQuery } from "@tanstack/react-query"

import { getAvailableConcerns, getAvailableSkinTypes } from "../profile-api"

export function useAvailableSkinTypes(username: string, enabled = true) {
  return useQuery({
    queryKey: ["profile", username, "available-skin-types"],
    queryFn: () => getAvailableSkinTypes(username),
    enabled: Boolean(username) && enabled,
    staleTime: 2 * 60 * 1000,
  })
}

export function useAvailableConcerns(username: string, enabled = true) {
  return useQuery({
    queryKey: ["profile", username, "available-concerns"],
    queryFn: () => getAvailableConcerns(username),
    enabled: Boolean(username) && enabled,
    staleTime: 2 * 60 * 1000,
  })
}
