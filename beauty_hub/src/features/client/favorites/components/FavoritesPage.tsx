"use client"

import { useState } from "react"
import { AlertCircle, Heart, RefreshCcw, Trash2 } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { FavoriteProductCard } from "./FavoriteProductCard"
import { useUserFavorites } from "../hooks/useUserFavorites"

function FavoritesSkeleton() {
  return (
    <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="h-full min-w-0">
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-3/4" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-7 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function FavoritesPage() {
  const {
    username,
    favoritesQuery,
    favorites,
    removeFavorite,
    removeFavoritesBulk,
    removingProductId,
    isRemovingFavorite,
    isRemovingFavoritesBulk,
  } = useUserFavorites()
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])
  const [confirmBulkDeleteOpen, setConfirmBulkDeleteOpen] = useState(false)

  const selectedCount = selectedProductIds.length

  const clearSelection = () => {
    setSelectionMode(false)
    setSelectedProductIds([])
    setConfirmBulkDeleteOpen(false)
  }

  const handleSelectionChange = (productId: number, selected: boolean) => {
    setSelectedProductIds((currentSelection) => {
      if (selected) {
        return currentSelection.includes(productId)
          ? currentSelection
          : [...currentSelection, productId]
      }

      return currentSelection.filter((selectedProductId) => {
        return selectedProductId !== productId
      })
    })
  }

  const handleBulkDelete = () => {
    removeFavoritesBulk(selectedProductIds, {
      onSuccess: clearSelection,
    })
  }

  if (!username) {
    return (
      <div className="flex min-w-0 max-w-full flex-col gap-6 overflow-hidden px-2 py-2 md:px-4 xl:px-8">
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>No encontramos tu usuario activo</AlertTitle>
          <AlertDescription>
            Inicia sesión nuevamente para cargar tus productos favoritos.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-6 overflow-hidden px-2 py-2 md:px-4 xl:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-3xl flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Beauty Hub
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Favoritos
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Consulta los productos que guardaste y elimina los que ya no quieras
            seguir.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectionMode ? (
            <>
              <Button variant="outline" onClick={clearSelection}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  setConfirmBulkDeleteOpen(true)
                }}
                disabled={selectedCount === 0}
              >
                <Trash2 aria-hidden="true" data-icon="inline-start" />
                Eliminar seleccionados
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectionMode(true)
                }}
                disabled={favorites.length === 0}
              >
                Seleccionar
              </Button>
              <Button
                onClick={() => {
                  void favoritesQuery.refetch()
                }}
                disabled={favoritesQuery.isFetching}
              >
                <RefreshCcw aria-hidden="true" data-icon="inline-start" />
                {favoritesQuery.isFetching ? "Actualizando" : "Actualizar"}
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator />

      {favoritesQuery.isLoading ? (
        <FavoritesSkeleton />
      ) : favoritesQuery.error ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>No se pudieron cargar tus favoritos</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {favoritesQuery.error.message ||
                "Intenta nuevamente en unos segundos."}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void favoritesQuery.refetch()
              }}
            >
              Intentar de nuevo
            </Button>
          </AlertDescription>
        </Alert>
      ) : favorites.length === 0 ? (
        <Alert>
          <Heart aria-hidden="true" />
          <AlertTitle>Aún no tienes productos favoritos</AlertTitle>
          <AlertDescription>
            Cuando guardes productos, aparecerán en esta sección para que puedas
            consultarlos rápidamente.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((favorite) => (
            <FavoriteProductCard
              key={favorite.product.productId}
              favorite={favorite}
              isRemoving={
                isRemovingFavorite &&
                removingProductId === favorite.product.productId
              }
              selectionMode={selectionMode}
              selected={selectedProductIds.includes(favorite.product.productId)}
              onRemove={removeFavorite}
              onSelectionChange={handleSelectionChange}
            />
          ))}
        </div>
      )}

      <AlertDialog
        open={confirmBulkDeleteOpen}
        onOpenChange={setConfirmBulkDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="mx-auto size-14 rounded-full bg-destructive/10 text-destructive">
              <Trash2 aria-hidden="true" className="size-7" />
            </AlertDialogMedia>
            <AlertDialogTitle>Eliminar favoritos seleccionados</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminarán {selectedCount} productos de tus favoritos. Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovingFavoritesBulk}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isRemovingFavoritesBulk}
            >
              {isRemovingFavoritesBulk ? "Eliminando" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
