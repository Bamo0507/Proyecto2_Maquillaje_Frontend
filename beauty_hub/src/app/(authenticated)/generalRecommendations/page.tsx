import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recomendaciones generales | Beauty Hub",
}

export default function Page() {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-2">
      <p className="text-sm text-muted-foreground">Beauty Hub</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Recomendaciones generales
      </h1>
    </div>
  )
}
