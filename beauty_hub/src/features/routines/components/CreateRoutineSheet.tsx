"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarPlusIcon } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

import { useCreateRoutine } from "../hooks/useCreateRoutine"

const routineSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  timeOfDay: z.string().min(1, "Selecciona un momento"),
  description: z.string().optional(),
  skinFocus: z.string().optional(),
  targetConcerns: z.string().optional(),
  frequency: z.string().optional(),
})

type RoutineFormValues = z.infer<typeof routineSchema>

interface CreateRoutineSheetProps {
  username: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function splitTextList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

export function CreateRoutineSheet({
  username,
  open,
  onOpenChange,
}: CreateRoutineSheetProps) {
  const createRoutineMutation = useCreateRoutine(username)
  const form = useForm<RoutineFormValues>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      name: "",
      timeOfDay: "Mañana",
      description: "",
      skinFocus: "",
      targetConcerns: "",
      frequency: "",
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    createRoutineMutation.mutate(
      {
        name: values.name.trim(),
        timeOfDay: values.timeOfDay,
        description: values.description?.trim() || null,
        skinFocus: values.skinFocus?.trim() || null,
        targetConcerns: splitTextList(values.targetConcerns),
        hasRoutine: {
          isActive: true,
          frequency: values.frequency?.trim() || null,
        },
      },
      {
        onSuccess: () => {
          toast.success("Rutina creada correctamente")
          form.reset()
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message || "No pudimos crear la rutina")
        },
      }
    )
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CalendarPlusIcon aria-hidden="true" className="size-4" />
            Crear rutina
          </SheetTitle>
          <SheetDescription>
            Define la base de la rutina. Puedes agregar productos después.
          </SheetDescription>
        </SheetHeader>

        <form className="flex flex-1 flex-col gap-5 px-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="routine-name">Nombre</Label>
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <Input id="routine-name" placeholder="Rutina de mañana" {...field} />
              )}
            />
            {form.formState.errors.name ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="grid items-start gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="routine-time">Momento del día</Label>
              <Controller
                control={form.control}
                name="timeOfDay"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="routine-time" className="h-10 w-full px-3">
                      <SelectValue placeholder="Selecciona un momento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Mañana">Mañana</SelectItem>
                        <SelectItem value="Tarde">Tarde</SelectItem>
                        <SelectItem value="Noche">Noche</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="routine-frequency">Frecuencia</Label>
              <Controller
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <Input id="routine-frequency" placeholder="Diaria" {...field} />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="routine-skin-focus">Enfoque de piel</Label>
            <Controller
              control={form.control}
              name="skinFocus"
              render={({ field }) => (
                <Input id="routine-skin-focus" placeholder="Hidratación" {...field} />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="routine-concerns">Preocupaciones</Label>
            <Controller
              control={form.control}
              name="targetConcerns"
              render={({ field }) => (
                <Input
                  id="routine-concerns"
                  placeholder="acné, manchas, resequedad"
                  {...field}
                />
              )}
            />
            <p className="text-xs text-muted-foreground">
              Separa cada preocupación con coma.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="routine-description">Descripción</Label>
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Textarea
                  id="routine-description"
                  placeholder="Objetivo de esta rutina..."
                  className="min-h-24"
                  {...field}
                />
              )}
            />
          </div>

          <SheetFooter className="px-0">
            <Button
              type="submit"
              className="h-11 px-6"
              disabled={createRoutineMutation.isPending}
            >
              {createRoutineMutation.isPending ? "Creando..." : "Crear rutina"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
