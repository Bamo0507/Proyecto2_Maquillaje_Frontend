import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reviews | Beauty Hub",
}

export default function Page() {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-2">
      <p className="text-sm text-muted-foreground">Beauty Hub</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Reviews
      </h1>
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Aqui veras las reseñas y valoraciones de productos cuando conectemos los
        datos del backend.
      </p>
    </div>
  )
}
