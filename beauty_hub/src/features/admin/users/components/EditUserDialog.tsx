"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Textarea } from "@/components/ui/textarea"

import { useUpdateAdminUser } from "../hooks/useAdminUserMutations"
import type { AdminUser } from "../types"
import {
  splitTextList,
  toNullableNumber,
  toTextList,
} from "../utils/user-formatters"

const editUserSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().optional(),
  age: z.string().optional(),
  country: z.string().optional(),
  preferences: z.string().optional(),
  monthlyBudget: z.string().optional(),
  isPremium: z.boolean(),
})

type EditUserFormValues = z.infer<typeof editUserSchema>

interface EditUserDialogProps {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const updateUserMutation = useUpdateAdminUser()
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    values: {
      email: user?.email ?? "",
      password: "",
      age: user?.age != null ? `${user.age}` : "",
      country: user?.country ?? "",
      preferences: toTextList(user?.preferences).join(", "),
      monthlyBudget: user?.monthlyBudget != null ? `${user.monthlyBudget}` : "",
      isPremium: user?.isPremium ?? false,
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (!user) {
      return
    }

    updateUserMutation.mutate(
      {
        username: user.username,
        input: {
          email: values.email.trim(),
          password: values.password?.trim() || null,
          age: toNullableNumber(values.age),
          country: values.country?.trim() || null,
          preferences: values.preferences ? splitTextList(values.preferences) : null,
          monthlyBudget: toNullableNumber(values.monthlyBudget),
          isPremium: values.isPremium,
        },
      },
      {
        onSuccess: () => {
          toast.success("Usuario actualizado correctamente")
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message || "No pudimos actualizar el usuario")
        },
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
          <DialogDescription>
            Actualiza datos administrativos de {user?.username ?? "este usuario"}.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label>Username</Label>
              <Input value={user?.username ?? ""} disabled />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="edit-email">Correo</Label>
              <Controller
                control={form.control}
                name="email"
                render={({ field }) => (
                  <Input id="edit-email" type="email" {...field} />
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-password">Nueva contraseña</Label>
              <Controller
                control={form.control}
                name="password"
                render={({ field }) => (
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="Sin cambios"
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-age">Edad</Label>
              <Controller
                control={form.control}
                name="age"
                render={({ field }) => (
                  <Input id="edit-age" type="number" min={0} {...field} />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-country">País</Label>
              <Controller
                control={form.control}
                name="country"
                render={({ field }) => <Input id="edit-country" {...field} />}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-preferences">Preferencias</Label>
              <Controller
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <Textarea
                    id="edit-preferences"
                    className="min-h-20"
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-budget">Presupuesto</Label>
              <Controller
                control={form.control}
                name="monthlyBudget"
                render={({ field }) => (
                  <Input id="edit-budget" type="number" min={0} {...field} />
                )}
              />
            </div>
          </div>

          <Controller
            control={form.control}
            name="isPremium"
            render={({ field }) => (
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(value) => field.onChange(Boolean(value))}
                />
                Usuario premium
              </label>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
