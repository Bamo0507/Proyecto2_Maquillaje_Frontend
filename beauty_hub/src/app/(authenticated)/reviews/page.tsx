import type { Metadata } from "next"

import { ReviewsPage } from "@/features/client/reviews/components/ReviewsPage"

export const metadata: Metadata = {
  title: "Reviews | Beauty Hub",
}

export default function Page() {
  return <ReviewsPage />
}
