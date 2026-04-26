"use client"

import { useQuery } from "@tanstack/react-query"

import { getRoutineRecommendations } from "../client-recommendations-api"

export function useRoutineRecommendations(username: string) {
  return useQuery({
    queryKey: ["client", "recommendations", "routine", username],
    queryFn: () => getRoutineRecommendations(username),
    enabled: Boolean(username),
    staleTime: 5 * 60 * 1000,
  })
}
