"use client"

import { AlertTriangleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type ConfirmActionKind =
  | "delete"
  | "delete-budget"
  | "premium-on"
  | "premium-off"

const ACTION_COPY: Record<
  ConfirmActionKind,
  { title: string; description: string; confirm: string; destructive?: boolean }
> = {
  delete: {
    title: "Eliminar usuarios",
    description:
      "Esta acción eliminará los usuarios seleccionados y todas sus relaciones.",
    confirm: "Eliminar usuarios",
    destructive: true,
  },
  "delete-budget": {
    title: "Borrar presupuestos",
    description:
      "Esta acción eliminará el presupuesto mensual de los usuarios seleccionados.",
    confirm: "Borrar presupuestos",
  },
  "premium-on": {
    title: "Activar premium",
    description: "Los usuarios seleccionados recibirán privilegios premium.",
    confirm: "Hacer premium",
  },
  "premium-off": {
    title: "Quitar premium",
    description: "Los usuarios seleccionados perderán privilegios premium.",
    confirm: "Quitar premium",
  },
}

interface ConfirmBulkActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: ConfirmActionKind | null
  selectedCount: number
  isPending: boolean
  onConfirm: () => void
}

export function ConfirmBulkActionDialog({
  open,
  onOpenChange,
  action,
  selectedCount,
  isPending,
  onConfirm,
}: ConfirmBulkActionDialogProps) {
  const copy = action ? ACTION_COPY[action] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangleIcon aria-hidden="true" className="size-5" />
          </div>
          <DialogTitle>{copy?.title ?? "Confirmar acción"}</DialogTitle>
          <DialogDescription>
            {copy?.description} Se aplicará a {selectedCount} usuarios normales.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant={copy?.destructive ? "destructive" : "default"}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Procesando..." : copy?.confirm ?? "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
