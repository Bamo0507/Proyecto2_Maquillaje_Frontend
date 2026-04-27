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

import { useCreateAdminUser } from "../hooks/useAdminUserMutations"
import { splitTextList, toNullableNumber } from "../utils/user-formatters"

const createUserSchema = z.object({
  username: z.string().min(1, "El username es requerido"),
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(1, "La contraseña es requerida"),
  age: z.string().optional(),
  country: z.string().optional(),
  preferences: z.string().optional(),
  monthlyBudget: z.string().optional(),
  isPremium: z.boolean(),
  isAdmin: z.boolean(),
})

type CreateUserFormValues = z.infer<typeof createUserSchema>

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const createUserMutation = useCreateAdminUser()
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    values: {
      username: "",
      email: "",
      password: "",
      age: "",
      country: "",
      preferences: "",
      monthlyBudget: "",
      isPremium: false,
      isAdmin: false,
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    createUserMutation.mutate(
      {
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
        age: toNullableNumber(values.age),
        country: values.country?.trim() || null,
        preferences: splitTextList(values.preferences),
        monthlyBudget: toNullableNumber(values.monthlyBudget),
        isPremium: values.isPremium,
        isAdmin: values.isAdmin,
      },
      {
        onSuccess: () => {
          toast.success("Usuario creado correctamente")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          toast.error(error.message || "No pudimos crear el usuario")
        },
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear usuario</DialogTitle>
          <DialogDescription>
            Crea una cuenta con información inicial. Las preferencias se separan
            por coma.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-username">Username</Label>
              <Controller
                control={form.control}
                name="username"
                render={({ field }) => <Input id="create-username" {...field} />}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="create-email">Correo</Label>
              <Controller
                control={form.control}
                name="email"
                render={({ field }) => (
                  <Input id="create-email" type="email" {...field} />
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-password">Contraseña</Label>
              <Controller
                control={form.control}
                name="password"
                render={({ field }) => (
                  <Input id="create-password" type="password" {...field} />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-age">Edad</Label>
              <Controller
                control={form.control}
                name="age"
                render={({ field }) => (
                  <Input id="create-age" type="number" min={0} {...field} />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-country">País</Label>
              <Controller
                control={form.control}
                name="country"
                render={({ field }) => (
                  <Input id="create-country" placeholder="Guatemala" {...field} />
                )}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-preferences">Preferencias</Label>
              <Controller
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <Textarea
                    id="create-preferences"
                    className="min-h-20"
                    placeholder="vegano, sin fragancia, ligero"
                    {...field}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-budget">Presupuesto</Label>
              <Controller
                control={form.control}
                name="monthlyBudget"
                render={({ field }) => (
                  <Input
                    id="create-budget"
                    type="number"
                    min={0}
                    placeholder="80"
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Controller
              control={form.control}
              name="isPremium"
              render={({ field }) => (
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(value) => field.onChange(Boolean(value))}
                  />
                  Crear como premium
                </label>
              )}
            />
            <Controller
              control={form.control}
              name="isAdmin"
              render={({ field }) => (
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(value) => field.onChange(Boolean(value))}
                  />
                  Crear con etiqueta admin
                </label>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? "Creando..." : "Crear usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
