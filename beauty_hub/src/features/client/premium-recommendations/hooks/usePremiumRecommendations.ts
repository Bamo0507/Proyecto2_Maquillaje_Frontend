"use client"

import { useRecommendationsUsername } from "@/features/client/recommendations/hooks/useRecommendationsUsername"

import { useBudgetProducts } from "./useBudgetProducts"
import { useTopRankedProducts } from "./useTopRankedProducts"

export function usePremiumRecommendations() {
  const username = useRecommendationsUsername()
  const topRankedQuery = useTopRankedProducts()
  const budgetQuery = useBudgetProducts(username)

  const refetchAll = () => {
    void topRankedQuery.refetch()
    void budgetQuery.refetch()
  }

  return {
    username,
    topRankedQuery,
    budgetQuery,
    isFetching: topRankedQuery.isFetching || budgetQuery.isFetching,
    refetchAll,
  }
}
