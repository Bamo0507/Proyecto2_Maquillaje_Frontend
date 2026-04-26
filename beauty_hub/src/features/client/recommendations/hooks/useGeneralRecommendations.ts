"use client"

import { useRecommendationsUsername } from "./useRecommendationsUsername"
import { useRoutineRecommendations } from "./useRoutineRecommendations"
import { useSkinConcernRecommendations } from "./useSkinConcernRecommendations"
import { useSkinTypeRecommendations } from "./useSkinTypeRecommendations"

export function useGeneralRecommendations() {
  const username = useRecommendationsUsername()
  const skinTypeQuery = useSkinTypeRecommendations(username)
  const skinConcernQuery = useSkinConcernRecommendations(username)
  const routineQuery = useRoutineRecommendations(username)

  const refetchAll = () => {
    void skinTypeQuery.refetch()
    void skinConcernQuery.refetch()
    void routineQuery.refetch()
  }

  return {
    username,
    skinTypeQuery,
    skinConcernQuery,
    routineQuery,
    isLoading:
      skinTypeQuery.isLoading ||
      skinConcernQuery.isLoading ||
      routineQuery.isLoading,
    isFetching:
      skinTypeQuery.isFetching ||
      skinConcernQuery.isFetching ||
      routineQuery.isFetching,
    hasError:
      skinTypeQuery.isError || skinConcernQuery.isError || routineQuery.isError,
    refetchAll,
  }
}
