import type { Metadata } from "next"

import { PremiumRecommendationsPage } from "@/features/client/premium-recommendations/components/PremiumRecommendationsPage"

export const metadata: Metadata = {
  title: "Smart Picks | Beauty Hub",
}

export default function Page() {
  return <PremiumRecommendationsPage />
}
