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

import { useAvailableConcerns } from "../hooks/useAvailableProfileOptions"
import { useAddConcern, useUpdateConcern } from "../hooks/useProfileMutations"
import type { ConcernRelationInput, UserConcern } from "../types"

const concernSchema = z.object({
  concernName: z.string().min(1, "Selecciona una preocupación"),
  severity: z.string().regex(/^[1-5]$/, "Selecciona una severidad de 1 a 5"),
  isPrimary: z.boolean(),
  since: z.string().optional(),
})

type ConcernFormValues = z.infer<typeof concernSchema>

interface ConcernDialogProps {
  username: string
  open: boolean
  onOpenChange: (open: boolean) => void
  concern?: UserConcern | null
}

export function ConcernDialog({
  username,
  open,
  onOpenChange,
  concern,
}: ConcernDialogProps) {
  const isEditing = Boolean(concern)
  const availableConcernsQuery = useAvailableConcerns(username, open && !isEditing)
  const addConcernMutation = useAddConcern(username)
  const updateConcernMutation = useUpdateConcern(username)
  const form = useForm<ConcernFormValues>({
    resolver: zodResolver(concernSchema),
    values: {
      concernName: concern?.name ?? "",
      severity: concern?.severity ? `${concern.severity}` : "3",
      isPrimary: concern?.isPrimary ?? false,
      since: concern?.since ?? new Date().toISOString().slice(0, 10),
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    const input: ConcernRelationInput = {
      concernName: values.concernName,
      severity: Number(values.severity),
      isPrimary: values.isPrimary,
      since: values.since || null,
    }
    const mutation = isEditing ? updateConcernMutation : addConcernMutation

    mutation.mutate(input, {
      onSuccess: () => {
        toast.success(
          isEditing
            ? "Preocupación actualizada correctamente"
            : "Preocupación agregada correctamente"
        )
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(error.message || "No pudimos guardar la preocupación")
      },
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar preocupación" : "Agregar preocupación"}
          </DialogTitle>
          <DialogDescription>
            Define prioridad, severidad y fecha para este objetivo de cuidado.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label>Preocupación</Label>
            <Controller
              control={form.control}
              name="concernName"
              render={({ field }) =>
                isEditing ? (
                  <Input value={field.value} disabled />
                ) : (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Selecciona una preocupación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {(availableConcernsQuery.data?.concerns ?? []).map(
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
              <Label htmlFor="concern-severity">Severidad</Label>
              <Controller
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="concern-severity" className="h-10 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {["1", "2", "3", "4", "5"].map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="concern-since">Desde</Label>
              <Controller
                control={form.control}
                name="since"
                render={({ field }) => (
                  <Input id="concern-since" type="date" {...field} />
                )}
              />
            </div>
          </div>

          <Controller
            control={form.control}
            name="isPrimary"
            render={({ field }) => (
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(value) => field.onChange(Boolean(value))}
                />
                Es preocupación principal
              </label>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={addConcernMutation.isPending || updateConcernMutation.isPending}
            >
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
