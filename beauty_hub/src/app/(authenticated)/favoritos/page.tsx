import type { Metadata } from "next"

import { FavoritesPage } from "@/features/client/favorites/components/FavoritesPage"

export const metadata: Metadata = {
  title: "Favoritos | Beauty Hub",
}

export default function Page() {
  return <FavoritesPage />
}
