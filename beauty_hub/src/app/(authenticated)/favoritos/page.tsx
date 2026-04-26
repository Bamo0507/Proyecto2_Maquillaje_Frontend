import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Favoritos | Beauty Hub",
}

export default function Page() {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-2">
      <p className="text-sm text-muted-foreground">Beauty Hub</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Favoritos
      </h1>
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Los productos guardados apareceran aqui cuando el modulo de favoritos
        este conectado.
      </p>
    </div>
  )
}
