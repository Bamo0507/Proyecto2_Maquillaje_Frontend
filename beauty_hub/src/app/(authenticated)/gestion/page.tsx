import type { Metadata } from "next"

import { UserManagementPage } from "@/features/admin/users/components/UserManagementPage"

export const metadata: Metadata = {
  title: "Gestion | Beauty Hub",
}

export default function Page() {
  return <UserManagementPage />
}
