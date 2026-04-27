import type { Metadata } from "next"

import { RoutinesPage } from "@/features/routines/components/RoutinesPage"

export const metadata: Metadata = {
  title: "Rutinas | Beauty Hub",
}

export default function Page() {
  return <RoutinesPage />
}
