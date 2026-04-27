import type { Metadata } from "next"

import { ProfilePage } from "@/features/profile/components/ProfilePage"

export const metadata: Metadata = {
  title: "Perfil | Beauty Hub",
}

export default function Page() {
  return <ProfilePage />
}
