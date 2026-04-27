import type { Metadata } from "next"

import { ProductProfilePage } from "@/features/products/components/ProductProfilePage"

export const metadata: Metadata = {
  title: "Perfil de producto | Beauty Hub",
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return <ProductProfilePage productId={id} />
}
