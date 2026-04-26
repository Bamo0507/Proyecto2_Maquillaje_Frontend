import type { Metadata } from "next"

import { RecommendationsPage } from "@/features/client/recommendations/components/RecommendationsPage"

export const metadata: Metadata = {
  title: "Recomendaciones generales | Beauty Hub",
}

export default function Page() {
  return <RecommendationsPage />
}
