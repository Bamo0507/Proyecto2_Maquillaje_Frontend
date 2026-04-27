"use client"

import {
  BadgeDollarSignIcon,
  CrownIcon,
  RefreshCcwIcon,
  ShieldMinusIcon,
  Trash2Icon,
  UserPlusIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface UserManagementHeaderProps {
  selectedCount: number
  isFetching: boolean
  onCreateUser: () => void
  onRefresh: () => void
  onBulkPremium: (isPremium: boolean) => void
  onBulkBudget: () => void
  onBulkDeleteBudget: () => void
  onBulkDelete: () => void
}

export function UserManagementHeader({
  selectedCount,
  isFetching,
  onCreateUser,
  onRefresh,
  onBulkPremium,
  onBulkBudget,
  onBulkDeleteBudget,
  onBulkDelete,
}: UserManagementHeaderProps) {
  const hasSelection = selectedCount > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-3xl flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Admin</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Gestión de usuarios
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Administra usuarios, privilegios premium, presupuestos mensuales y
            eliminaciones desde una tabla controlada.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" disabled={isFetching} onClick={onRefresh}>
            <RefreshCcwIcon aria-hidden="true" data-icon="inline-start" />
            {isFetching ? "Actualizando" : "Actualizar"}
          </Button>
          <Button onClick={onCreateUser}>
            <UserPlusIcon aria-hidden="true" data-icon="inline-start" />
            Crear usuario
          </Button>
        </div>
      </div>

      {hasSelection ? (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{selectedCount} seleccionados</Badge>
            <span className="text-sm text-muted-foreground">
              Las acciones masivas solo aplican a usuarios normales.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkPremium(true)}
            >
              <CrownIcon aria-hidden="true" data-icon="inline-start" />
              Hacer premium
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkPremium(false)}
            >
              <ShieldMinusIcon aria-hidden="true" data-icon="inline-start" />
              Quitar premium
            </Button>
            <Button variant="outline" size="sm" onClick={onBulkBudget}>
              <BadgeDollarSignIcon aria-hidden="true" data-icon="inline-start" />
              Presupuesto
            </Button>
            <Button variant="outline" size="sm" onClick={onBulkDeleteBudget}>
              Borrar presupuesto
            </Button>
            <Button variant="destructive" size="sm" onClick={onBulkDelete}>
              <Trash2Icon aria-hidden="true" data-icon="inline-start" />
              Eliminar
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
