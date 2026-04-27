"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  useUpdateAdminUser,
  useUpdateAdminUsersMonthlyBudget,
} from "../hooks/useAdminUserMutations"

interface BudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usernames: string[]
  mode: "single" | "bulk"
}

export function BudgetDialog({
  open,
  onOpenChange,
  usernames,
  mode,
}: BudgetDialogProps) {
  const [monthlyBudget, setMonthlyBudget] = useState("")
  const updateUserMutation = useUpdateAdminUser()
  const updateBulkBudgetMutation = useUpdateAdminUsersMonthlyBudget()
  const isPending =
    updateUserMutation.isPending || updateBulkBudgetMutation.isPending
  const title =
    mode === "single" ? "Actualizar presupuesto" : "Actualizar presupuestos"

  const handleSubmit = () => {
    const parsedBudget = Number(monthlyBudget)

    if (!Number.isFinite(parsedBudget)) {
      toast.error("Ingresa un presupuesto válido")
      return
    }

    if (mode === "single") {
      updateUserMutation.mutate(
        {
          username: usernames[0],
          input: {
            email: null,
            password: null,
            age: null,
            country: null,
            preferences: null,
            monthlyBudget: parsedBudget,
            isPremium: null,
          },
        },
        {
          onSuccess: () => {
            toast.success("Presupuesto actualizado")
            onOpenChange(false)
            setMonthlyBudget("")
          },
          onError: (error) =>
            toast.error(error.message || "No pudimos actualizar el presupuesto"),
        }
      )
      return
    }

    updateBulkBudgetMutation.mutate(
      { usernames, monthlyBudget: parsedBudget },
      {
        onSuccess: () => {
          toast.success("Presupuestos actualizados")
          onOpenChange(false)
          setMonthlyBudget("")
        },
        onError: (error) =>
          toast.error(error.message || "No pudimos actualizar los presupuestos"),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {mode === "single"
              ? `Se actualizará el presupuesto de ${usernames[0]}.`
              : `Se actualizará el presupuesto de ${usernames.length} usuarios.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="admin-budget">Presupuesto mensual</Label>
          <Input
            id="admin-budget"
            type="number"
            min={0}
            value={monthlyBudget}
            onChange={(event) => setMonthlyBudget(event.target.value)}
            placeholder="80"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" disabled={isPending} onClick={handleSubmit}>
            {isPending ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
