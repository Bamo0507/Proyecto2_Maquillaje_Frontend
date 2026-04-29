"use client"

import { useState } from "react"
import {
  AlertCircle,
  MessageSquare,
  MessageSquarePlus,
  MessageSquareX,
  RefreshCcw,
} from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"

import { ReviewCard } from "./ReviewCard"
import { useUserReviews } from "../hooks/useUserReviews"
import type { UserReview } from "../types"

function ReviewsSkeleton() {
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ReviewsPage() {
  const {
    username,
    reviewsQuery,
    reviews,
    addComment,
    addCommentBulk,
    deleteComment,
    deleteCommentsBulk,
    commentingProductId,
    deletingProductId,
    isAddingComment,
    isAddingCommentBulk,
    isDeletingComment,
    isDeletingCommentsBulk,
  } = useUserReviews()
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activeReview, setActiveReview] = useState<UserReview | null>(null)
  const [commentText, setCommentText] = useState("")
  const [commentMode, setCommentMode] = useState<"single" | "bulk">("single")
  const [deleteMode, setDeleteMode] = useState<"single" | "bulk">("single")
  const [showOnlyWithoutComments, setShowOnlyWithoutComments] = useState(false)

  const selectedCount = selectedProductIds.length
  const visibleReviews = showOnlyWithoutComments
    ? reviews.filter((review) => {
        return !review.comment?.trim()
      })
    : reviews

  const clearSelection = () => {
    setSelectionMode(false)
    setSelectedProductIds([])
  }

  const closeCommentDialog = () => {
    setCommentDialogOpen(false)
    setActiveReview(null)
    setCommentText("")
    setCommentMode("single")
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setActiveReview(null)
    setDeleteMode("single")
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

  const openSingleCommentDialog = (review: UserReview) => {
    setActiveReview(review)
    setCommentText("")
    setCommentMode("single")
    setCommentDialogOpen(true)
  }

  const openBulkCommentDialog = () => {
    setActiveReview(null)
    setCommentText("")
    setCommentMode("bulk")
    setCommentDialogOpen(true)
  }

  const openSingleDeleteDialog = (review: UserReview) => {
    setActiveReview(review)
    setDeleteMode("single")
    setDeleteDialogOpen(true)
  }

  const openBulkDeleteDialog = () => {
    setActiveReview(null)
    setDeleteMode("bulk")
    setDeleteDialogOpen(true)
  }

  const toggleWithoutCommentsFilter = () => {
    setShowOnlyWithoutComments((currentValue) => !currentValue)
    clearSelection()
  }

  const handleSaveComment = () => {
    const trimmedComment = commentText.trim()

    if (!trimmedComment) {
      return
    }

    if (commentMode === "single" && activeReview) {
      addComment(
        {
          productId: activeReview.product.productId,
          comment: trimmedComment,
        },
        {
          onSuccess: closeCommentDialog,
        }
      )
      return
    }

    addCommentBulk(
      {
        productIds: selectedProductIds,
        comment: trimmedComment,
      },
      {
        onSuccess: () => {
          closeCommentDialog()
          clearSelection()
        },
      }
    )
  }

  const handleDeleteComment = () => {
    if (deleteMode === "single" && activeReview) {
      deleteComment(activeReview.product.productId, {
        onSuccess: closeDeleteDialog,
      })
      return
    }

    deleteCommentsBulk(selectedProductIds, {
      onSuccess: () => {
        closeDeleteDialog()
        clearSelection()
      },
    })
  }

  if (!username) {
    return (
      <div className="flex min-w-0 max-w-full flex-col gap-6 overflow-hidden px-2 py-2 md:px-4 xl:px-8">
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>No encontramos tu usuario activo</AlertTitle>
          <AlertDescription>
            Inicia sesión nuevamente para cargar tus reviews.
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
            Mis reviews
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Consulta tus valoraciones, agrega comentarios y administra tus
            opiniones sobre productos.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 lg:ml-auto">
          {selectionMode ? (
            <>
              <Button variant="outline" onClick={clearSelection}>
                Cancelar
              </Button>
              <Button
                variant="outline"
                onClick={openBulkCommentDialog}
                disabled={selectedCount === 0}
              >
                <MessageSquarePlus aria-hidden="true" data-icon="inline-start" />
                Agregar comentario
              </Button>
              <Button
                onClick={openBulkDeleteDialog}
                disabled={selectedCount === 0}
              >
                <MessageSquareX aria-hidden="true" data-icon="inline-start" />
                Eliminar comentarios
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectionMode(true)
                }}
                disabled={visibleReviews.length === 0}
              >
                Seleccionar
              </Button>
              <Button
                variant={showOnlyWithoutComments ? "secondary" : "outline"}
                onClick={toggleWithoutCommentsFilter}
                disabled={reviews.length === 0}
              >
                Sin comentarios
              </Button>
              <Button
                onClick={() => {
                  void reviewsQuery.refetch()
                }}
                disabled={reviewsQuery.isFetching}
              >
                <RefreshCcw aria-hidden="true" data-icon="inline-start" />
                {reviewsQuery.isFetching ? "Actualizando" : "Actualizar"}
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator />

      {reviewsQuery.isLoading ? (
        <ReviewsSkeleton />
      ) : reviewsQuery.error ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>No se pudieron cargar tus reviews</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {reviewsQuery.error.message ||
                "Intenta nuevamente en unos segundos."}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void reviewsQuery.refetch()
              }}
            >
              Intentar de nuevo
            </Button>
          </AlertDescription>
        </Alert>
      ) : reviews.length === 0 ? (
        <Alert>
          <MessageSquare aria-hidden="true" />
          <AlertTitle>Aún no tienes reviews</AlertTitle>
          <AlertDescription>
            Cuando valores productos, tus reviews aparecerán en esta sección.
          </AlertDescription>
        </Alert>
      ) : visibleReviews.length === 0 ? (
        <Alert>
          <MessageSquare aria-hidden="true" />
          <AlertTitle>No tienes reviews pendientes de comentario</AlertTitle>
          <AlertDescription>
            Todas tus reviews visibles ya tienen comentarios agregados.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleReviews.map((review) => (
            <ReviewCard
              key={review.product.productId}
              review={review}
              selectionMode={selectionMode}
              selected={selectedProductIds.includes(review.product.productId)}
              isAddingComment={
                isAddingComment &&
                commentingProductId === review.product.productId
              }
              isDeletingComment={
                isDeletingComment &&
                deletingProductId === review.product.productId
              }
              onSelectionChange={handleSelectionChange}
              onAddComment={openSingleCommentDialog}
              onDeleteComment={openSingleDeleteDialog}
            />
          ))}
        </div>
      )}

      <AlertDialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="mx-auto size-14 rounded-full bg-secondary text-secondary-foreground">
              <MessageSquarePlus aria-hidden="true" className="size-7" />
            </AlertDialogMedia>
            <AlertDialogTitle>
              {commentMode === "single"
                ? "Agregar comentario"
                : "Agregar comentario a seleccionadas"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {commentMode === "single"
                ? "Escribe un comentario para complementar tu valoración."
                : `Se agregará el mismo comentario a ${selectedCount} reviews seleccionadas sin comentario.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={commentText}
            onChange={(event) => {
              setCommentText(event.target.value)
            }}
            placeholder="Escribe tu comentario..."
            className="min-h-28"
          />
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isAddingComment || isAddingCommentBulk}
              onClick={closeCommentDialog}
            >
              Cancelar
            </AlertDialogCancel>
            <Button
              onClick={handleSaveComment}
              disabled={
                !commentText.trim() || isAddingComment || isAddingCommentBulk
              }
            >
              {isAddingComment || isAddingCommentBulk ? "Guardando" : "Guardar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="mx-auto size-14 rounded-full bg-destructive/10 text-destructive">
              <MessageSquareX aria-hidden="true" className="size-7" />
            </AlertDialogMedia>
            <AlertDialogTitle>
              {deleteMode === "single"
                ? "Eliminar comentario"
                : "Eliminar comentarios seleccionados"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteMode === "single"
                ? "Se eliminará el comentario de esta review. La valoración se conservará."
                : `Se eliminarán los comentarios de ${selectedCount} reviews seleccionadas. Las valoraciones se conservarán.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeletingComment || isDeletingCommentsBulk}
              onClick={closeDeleteDialog}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              disabled={isDeletingComment || isDeletingCommentsBulk}
            >
              {isDeletingComment || isDeletingCommentsBulk
                ? "Eliminando"
                : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
