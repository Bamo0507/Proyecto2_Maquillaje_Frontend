import { useCurrentUsername } from "@/hooks/use-current-username"

export function useRecommendationsUsername() {
  return useCurrentUsername()
}
