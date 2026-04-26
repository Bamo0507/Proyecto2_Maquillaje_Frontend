import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pagina no encontrada | Beauty Hub",
}

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] w-full max-w-6xl flex-col items-start justify-center gap-3">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Esta pagina no existe
      </h1>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">
        La ruta que intentaste abrir no esta disponible. Puedes volver a tus
        recomendaciones desde aqui.
      </p>
      <Link
        href="/generalRecommendations"
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        Volver a recomendaciones
      </Link>
    </div>
  )
}
