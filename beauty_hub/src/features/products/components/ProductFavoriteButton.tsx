"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { HeartIcon } from "lucide-react"
import { toast } from "sonner"

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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import {
  useAddProductFavorite,
  useDeleteProductFavorite,
} from "../hooks/useProductFavorite"
import type { ProductFavorite } from "../types"

interface FavoriteFormValues {
  notes: string
  isPurchased: boolean
}

interface ProductFavoriteButtonProps {
  productId: number
  username: string
  favorite?: ProductFavorite
}

export function ProductFavoriteButton({
  productId,
  username,
  favorite,
}: ProductFavoriteButtonProps) {
  const [open, setOpen] = useState(false)
  const addFavoriteMutation = useAddProductFavorite(productId, username)
  const deleteFavoriteMutation = useDeleteProductFavorite(productId, username)
  const isFavorite = Boolean(favorite?.isFavorite)
  const isPending = addFavoriteMutation.isPending || deleteFavoriteMutation.isPending

  const form = useForm<FavoriteFormValues>({
    defaultValues: {
      notes: favorite?.notes ?? "",
      isPurchased: Boolean(favorite?.isPurchased),
    },
  })

  const handleToggle = () => {
    if (!username) {
      toast.error("No encontramos tu usuario activo")
      return
    }

    if (isFavorite) {
      deleteFavoriteMutation.mutate(undefined, {
        onSuccess: () => {
          toast.success("Producto eliminado de favoritos")
        },
        onError: (error) => {
          toast.error(error.message || "No pudimos quitar el favorito")
        },
      })
      return
    }

    form.reset({
      notes: "",
      isPurchased: false,
    })
    setOpen(true)
  }

  const handleSubmit = form.handleSubmit((values) => {
    addFavoriteMutation.mutate(
      {
        productId,
        notes: values.notes.trim() || null,
        isPurchased: values.isPurchased,
      },
      {
        onSuccess: () => {
          toast.success("Producto agregado a favoritos")
          setOpen(false)
        },
        onError: (error) => {
          toast.error(error.message || "No pudimos agregar el favorito")
        },
      }
    )
  })

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 size-11 rounded-full bg-background/80 shadow-sm backdrop-blur hover:bg-primary/10"
        disabled={isPending}
        onClick={handleToggle}
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <HeartIcon
          aria-hidden="true"
          className={cn("size-5 text-primary", isFavorite && "fill-current")}
        />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar a favoritos</DialogTitle>
            <DialogDescription>
              Puedes guardar una nota y marcar si ya compraste este producto.
            </DialogDescription>
          </DialogHeader>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="favorite-notes">Notas</Label>
              <Controller
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <Textarea
                    id="favorite-notes"
                    placeholder="Por qué te interesa este producto..."
                    className="min-h-24"
                    {...field}
                  />
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="isPurchased"
              render={({ field }) => (
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(value) => field.onChange(Boolean(value))}
                  />
                  Ya lo compré
                </label>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={addFavoriteMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={addFavoriteMutation.isPending}>
                {addFavoriteMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
