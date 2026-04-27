"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

import {
  useDeleteMonthlyBudget,
  useUpdateProfile,
} from "../hooks/useProfileMutations"
import type { UserProfileResponse } from "../types"
import { splitTextList, toTextList } from "../utils/profile-formatters"

const profileSchema = z.object({
  age: z.string().optional(),
  country: z.string().optional(),
  preferences: z.string().optional(),
  monthlyBudget: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileEditSheetProps {
  username: string
  profile: UserProfileResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileEditSheet({
  username,
  profile,
  open,
  onOpenChange,
}: ProfileEditSheetProps) {
  const updateProfileMutation = useUpdateProfile(username)
  const deleteBudgetMutation = useDeleteMonthlyBudget(username)
  const preferences = toTextList(profile.user.preferences)
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      age: profile.user.age ? `${profile.user.age}` : "",
      country: profile.user.country ?? "",
      preferences: preferences.join(", "),
      monthlyBudget:
        profile.user.monthlyBudget != null ? `${profile.user.monthlyBudget}` : "",
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    updateProfileMutation.mutate(
      {
        age: values.age ? Number(values.age) : null,
        country: values.country?.trim() || null,
        preferences: values.preferences ? splitTextList(values.preferences) : null,
        monthlyBudget: values.monthlyBudget ? Number(values.monthlyBudget) : null,
      },
      {
        onSuccess: () => {
          toast.success("Perfil actualizado correctamente")
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message || "No pudimos actualizar el perfil")
        },
      }
    )
  })

  const handleDeleteBudget = () => {
    deleteBudgetMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Presupuesto mensual eliminado")
      },
      onError: (error) => {
        toast.error(error.message || "No pudimos eliminar el presupuesto")
      },
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Editar perfil</SheetTitle>
          <SheetDescription>
            Actualiza la información que se usa para personalizar tus
            recomendaciones.
          </SheetDescription>
        </SheetHeader>

        <form className="flex flex-1 flex-col gap-5 px-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-age">Edad</Label>
              <Controller
                control={form.control}
                name="age"
                render={({ field }) => (
                  <Input id="profile-age" type="number" min={0} {...field} />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="profile-country">País</Label>
              <Controller
                control={form.control}
                name="country"
                render={({ field }) => (
                  <Input id="profile-country" placeholder="Guatemala" {...field} />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-budget">Presupuesto mensual</Label>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <Controller
                control={form.control}
                name="monthlyBudget"
                render={({ field }) => (
                  <Input
                    id="profile-budget"
                    type="number"
                    min={0}
                    placeholder="80"
                    {...field}
                  />
                )}
              />
              <Button
                type="button"
                variant="outline"
                disabled={
                  profile.user.monthlyBudget == null ||
                  deleteBudgetMutation.isPending
                }
                onClick={handleDeleteBudget}
              >
                <Trash2Icon aria-hidden="true" data-icon="inline-start" />
                Borrar
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-preferences">Preferencias</Label>
            <Controller
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <Textarea
                  id="profile-preferences"
                  placeholder="vegano, sin fragancia, ligero"
                  className="min-h-24"
                  {...field}
                />
              )}
            />
            <p className="text-xs text-muted-foreground">
              Separa cada preferencia con coma.
            </p>
          </div>

          <SheetFooter className="px-0">
            <Button
              type="submit"
              className="h-11 px-6"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
