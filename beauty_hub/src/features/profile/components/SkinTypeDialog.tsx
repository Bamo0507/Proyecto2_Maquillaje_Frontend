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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useAvailableSkinTypes } from "../hooks/useAvailableProfileOptions"
import { useAddSkinType, useUpdateSkinType } from "../hooks/useProfileMutations"
import type { UserSkinType } from "../types"

const skinTypeSchema = z.object({
  skinTypeName: z.string().min(1, "Selecciona un tipo de piel"),
  confirmedAt: z.string().optional(),
  selfDiagnosed: z.boolean(),
  sensitivity: z.string().optional(),
  area: z.string().optional(),
})

type SkinTypeFormValues = z.infer<typeof skinTypeSchema>

interface SkinTypeDialogProps {
  username: string
  open: boolean
  onOpenChange: (open: boolean) => void
  skinType?: UserSkinType | null
}

export function SkinTypeDialog({
  username,
  open,
  onOpenChange,
  skinType,
}: SkinTypeDialogProps) {
  const isEditing = Boolean(skinType)
  const availableSkinTypesQuery = useAvailableSkinTypes(username, open && !isEditing)
  const addSkinTypeMutation = useAddSkinType(username)
  const updateSkinTypeMutation = useUpdateSkinType(username)
  const form = useForm<SkinTypeFormValues>({
    resolver: zodResolver(skinTypeSchema),
    values: {
      skinTypeName: skinType?.name ?? "",
      confirmedAt: skinType?.confirmedAt ?? new Date().toISOString().slice(0, 10),
      selfDiagnosed: skinType?.selfDiagnosed ?? true,
      sensitivity: skinType?.sensitivity ?? "",
      area: skinType?.area ?? "",
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    const input = {
      skinTypeName: values.skinTypeName,
      confirmedAt: values.confirmedAt || null,
      selfDiagnosed: values.selfDiagnosed,
      sensitivity: values.sensitivity?.trim() || null,
      area: values.area?.trim() || null,
    }
    const mutation = isEditing ? updateSkinTypeMutation : addSkinTypeMutation

    mutation.mutate(input, {
      onSuccess: () => {
        toast.success(
          isEditing
            ? "Tipo de piel actualizado correctamente"
            : "Tipo de piel agregado correctamente"
        )
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || "No pudimos guardar el tipo de piel")
      },
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar tipo de piel" : "Agregar tipo de piel"}
          </DialogTitle>
          <DialogDescription>
            Ajusta cómo se relaciona este tipo de piel con tu perfil.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label>Tipo de piel</Label>
            <Controller
              control={form.control}
              name="skinTypeName"
              render={({ field }) =>
                isEditing ? (
                  <Input value={field.value} disabled />
                ) : (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {(availableSkinTypesQuery.data?.skinTypes ?? []).map(
                          (item) => (
                            <SelectItem key={item.name} value={item.name}>
                              {item.name}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="skin-type-date">Confirmado el</Label>
              <Controller
                control={form.control}
                name="confirmedAt"
                render={({ field }) => (
                  <Input id="skin-type-date" type="date" {...field} />
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="skin-type-area">Área</Label>
              <Controller
                control={form.control}
                name="area"
                render={({ field }) => (
                  <Input id="skin-type-area" placeholder="Rostro" {...field} />
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="skin-type-sensitivity">Sensibilidad</Label>
            <Controller
              control={form.control}
              name="sensitivity"
              render={({ field }) => (
                <Input
                  id="skin-type-sensitivity"
                  placeholder="baja, media, alta"
                  {...field}
                />
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="selfDiagnosed"
            render={({ field }) => (
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(value) => field.onChange(Boolean(value))}
                />
                Autodiagnosticado
              </label>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={addSkinTypeMutation.isPending || updateSkinTypeMutation.isPending}
            >
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
