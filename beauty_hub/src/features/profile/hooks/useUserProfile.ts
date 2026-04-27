"use client"

import { useQuery } from "@tanstack/react-query"

import { getUserProfile } from "../profile-api"

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => getUserProfile(username),
    enabled: Boolean(username),
    staleTime: 2 * 60 * 1000,
  })
}
