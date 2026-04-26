import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Perfil | Beauty Hub",
}

export default function Page() {
  return (
    <div className="flex w-full max-w-6xl flex-col gap-2">
      <p className="text-sm text-muted-foreground">Beauty Hub</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Perfil
      </h1>
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Aqui se mostrara la informacion del perfil del usuario y sus
        preferencias.
      </p>
    </div>
  )
}
