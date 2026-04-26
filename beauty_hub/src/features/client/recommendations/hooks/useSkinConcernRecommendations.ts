"use client"

import { useQuery } from "@tanstack/react-query"

import { getRecommendationsBySkinConcern } from "../client-recommendations-api"

export function useSkinConcernRecommendations(username: string) {
  return useQuery({
    queryKey: ["client", "recommendations", "skin-concern", username],
    queryFn: () => getRecommendationsBySkinConcern(username),
    enabled: Boolean(username),
    staleTime: 5 * 60 * 1000,
  })
}
