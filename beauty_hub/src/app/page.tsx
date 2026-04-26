import type { Metadata } from "next";

import { LoginPage } from "@/features/auth/components/LoginPage";

export const metadata: Metadata = {
  title: "Inicio de sesion | Beauty Hub",
};

export default function Page() {
  return <LoginPage />;
}
