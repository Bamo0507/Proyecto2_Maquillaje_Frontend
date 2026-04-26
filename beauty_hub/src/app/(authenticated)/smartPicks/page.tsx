import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Smart Picks | Beauty Hub",
}

export default function Page() {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-2">
      <p className="text-sm text-muted-foreground">Beauty Hub</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Smart Picks
      </h1>
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Las recomendaciones inteligentes para usuarios premium se cargaran en
        esta vista.
      </p>
    </div>
  )
}
