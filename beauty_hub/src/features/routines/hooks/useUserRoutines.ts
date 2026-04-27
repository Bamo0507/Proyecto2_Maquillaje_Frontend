"use client"

import { useQuery } from "@tanstack/react-query"

import { getUserRoutines } from "../routines-api"

export function useUserRoutines(username: string) {
  return useQuery({
    queryKey: ["routines", "user", username],
    queryFn: () => getUserRoutines(username),
    enabled: Boolean(username),
    staleTime: 2 * 60 * 1000,
  })
}
