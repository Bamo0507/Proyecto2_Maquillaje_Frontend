"use client"

import { useQuery } from "@tanstack/react-query"

import { getRecommendationsBySkinType } from "../client-recommendations-api"

export function useSkinTypeRecommendations(username: string) {
  return useQuery({
    queryKey: ["client", "recommendations", "skin-type", username],
    queryFn: () => getRecommendationsBySkinType(username),
    enabled: Boolean(username),
    staleTime: 5 * 60 * 1000,
  })
}
