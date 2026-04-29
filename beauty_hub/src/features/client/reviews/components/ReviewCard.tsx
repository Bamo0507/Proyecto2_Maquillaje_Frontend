"use client"

import type { KeyboardEvent, MouseEvent } from "react"
import { useRouter } from "next/navigation"
import {
  MessageSquarePlus,
  MessageSquareX,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

import type { UserReview } from "../types"

interface ReviewCardProps {
  review: UserReview
  selectionMode: boolean
  selected: boolean
  isAddingComment: boolean
  isDeletingComment: boolean
  onSelectionChange: (productId: number, selected: boolean) => void
  onAddComment: (review: UserReview) => void
  onDeleteComment: (review: UserReview) => void
}

const reviewBadgeClassName = "bg-secondary text-secondary-foreground"

function formatDate(value?: string | null) {
  if (!value) {
    return "Fecha no disponible"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
  }).format(date)
}

function getRecommendationLabel(wouldRecommend?: boolean | null) {
  if (wouldRecommend === true) {
    return "Lo recomienda"
  }

  if (wouldRecommend === false) {
    return "No lo recomienda"
  }

  return "Sin recomendación"
}

export function ReviewCard({
  review,
  selectionMode,
  selected,
  isAddingComment,
  isDeletingComment,
  onSelectionChange,
  onAddComment,
  onDeleteComment,
}: ReviewCardProps) {
  const router = useRouter()
  const hasComment = Boolean(review.comment?.trim())

  const goToProductProfile = () => {
    if (selectionMode) {
      onSelectionChange(review.product.productId, !selected)
      return
    }

    router.push(`/productos/${review.product.productId}`)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      goToProductProfile()
    }
  }

  const handleSelectionChange = (checked: boolean | "indeterminate") => {
    onSelectionChange(review.product.productId, checked === true)
  }

  const handleAddComment = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onAddComment(review)
  }

  const handleDeleteComment = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onDeleteComment(review)
  }

  return (
    <Card
      size="sm"
      role="button"
      tabIndex={0}
      onClick={goToProductProfile}
      onKeyDown={handleKeyDown}
      className="h-full min-w-0 cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <CardHeader>
        <CardDescription className="truncate">
          {review.product.brand || "Producto reseñado"}
        </CardDescription>
        <CardTitle className="line-clamp-2 min-h-10">
          {review.product.name}
        </CardTitle>
        <CardAction>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className={reviewBadgeClassName}>
              <Star aria-hidden="true" data-icon="inline-start" />
              {review.rating}
            </Badge>
            {selectionMode ? (
              <Checkbox
                checked={selected}
                onCheckedChange={handleSelectionChange}
                onClick={(event) => {
                  event.stopPropagation()
                }}
                aria-label={`Seleccionar review de ${review.product.name}`}
              />
            ) : hasComment ? (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDeleteComment}
                disabled={isDeletingComment}
                aria-label="Eliminar comentario"
                title="Eliminar comentario"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <MessageSquareX aria-hidden="true" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleAddComment}
                disabled={isAddingComment}
                aria-label="Agregar comentario"
                title="Agregar comentario"
              >
                <MessageSquarePlus aria-hidden="true" />
              </Button>
            )}
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={reviewBadgeClassName}>
            {review.wouldRecommend ? (
              <ThumbsUp aria-hidden="true" data-icon="inline-start" />
            ) : (
              <ThumbsDown aria-hidden="true" data-icon="inline-start" />
            )}
            {getRecommendationLabel(review.wouldRecommend)}
          </Badge>
          <Badge variant="secondary" className={reviewBadgeClassName}>
            {formatDate(review.reviewDate)}
          </Badge>
        </div>

        <div className="flex flex-col gap-3 rounded-lg bg-muted/60 p-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Comentario</span>
            <span className="font-medium">
              {hasComment ? "Agregado" : "Pendiente"}
            </span>
          </div>
          {hasComment ? (
            <p className="line-clamp-3 leading-5 text-muted-foreground">
              {review.comment}
            </p>
          ) : (
            <p className="leading-5 text-muted-foreground">
              Aún no agregaste un comentario para esta valoración.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
