import { EditIcon, RefreshCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ProfileHeaderProps {
  isFetching: boolean
  onEdit: () => void
  onRefresh: () => void
}

export function ProfileHeader({
  isFetching,
  onEdit,
  onRefresh,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex max-w-3xl flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Beauty Hub</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          Perfil
        </h1>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          Administra tu información, tus tipos de piel y tus preocupaciones para
          mejorar tus recomendaciones.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={isFetching} onClick={onRefresh}>
          <RefreshCcwIcon aria-hidden="true" data-icon="inline-start" />
          {isFetching ? "Actualizando" : "Actualizar"}
        </Button>
        <Button onClick={onEdit}>
          <EditIcon aria-hidden="true" data-icon="inline-start" />
          Editar perfil
        </Button>
      </div>
    </div>
  )
}
