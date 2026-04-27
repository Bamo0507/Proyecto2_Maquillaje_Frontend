"use client"

import type { KeyboardEvent, MouseEvent } from "react"
import { useRouter } from "next/navigation"
import {
  HeartOff,
  Leaf,
  ShieldCheck,
  Star,
  Trash2,
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

import type { UserFavorite } from "../types"

interface FavoriteProductCardProps {
  favorite: UserFavorite
  isRemoving: boolean
  selectionMode: boolean
  selected: boolean
  onRemove: (productId: number) => void
  onSelectionChange: (productId: number, selected: boolean) => void
}

const favoriteBadgeClassName = "bg-secondary text-secondary-foreground"

function formatPrice(price: number) {
  if (!Number.isFinite(price)) {
    return "Precio no disponible"
  }

  return `$${price.toFixed(2)}`
}

function ProductBadges({ favorite }: { favorite: UserFavorite }) {
  const { product } = favorite

  return (
    <div className="flex flex-wrap gap-2">
      {product.isVegan ? (
        <Badge variant="secondary" className={favoriteBadgeClassName}>
          <Leaf aria-hidden="true" data-icon="inline-start" />
          Vegano
        </Badge>
      ) : null}
      {product.isCrueltyFree ? (
        <Badge variant="secondary" className={favoriteBadgeClassName}>
          <ShieldCheck aria-hidden="true" data-icon="inline-start" />
          Cruelty free
        </Badge>
      ) : null}
      {favorite.favorite.isPurchased ? (
        <Badge variant="secondary" className={favoriteBadgeClassName}>
          Comprado
        </Badge>
      ) : null}
    </div>
  )
}

export function FavoriteProductCard({
  favorite,
  isRemoving,
  selectionMode,
  selected,
  onRemove,
  onSelectionChange,
}: FavoriteProductCardProps) {
  const router = useRouter()
  const { product } = favorite
  const goToProductProfile = () => {
    if (selectionMode) {
      onSelectionChange(product.productId, !selected)
      return
    }

    router.push(`/productos/${product.productId}`)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      goToProductProfile()
    }
  }

  const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onRemove(product.productId)
  }

  const handleSelectionChange = (checked: boolean | "indeterminate") => {
    onSelectionChange(product.productId, checked === true)
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
          {product.brand || "Producto favorito"}
        </CardDescription>
        <CardTitle className="line-clamp-2 min-h-10">{product.name}</CardTitle>
        <CardAction>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className={favoriteBadgeClassName}>
              <Star aria-hidden="true" data-icon="inline-start" />
              {product.rating}
            </Badge>
            {selectionMode ? (
              <Checkbox
                checked={selected}
                onCheckedChange={handleSelectionChange}
                onClick={(event) => {
                  event.stopPropagation()
                }}
                aria-label={`Seleccionar ${product.name}`}
              />
            ) : (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleRemove}
                disabled={isRemoving}
                aria-label="Quitar de favoritos"
                title="Quitar de favoritos"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 aria-hidden="true" />
              </Button>
            )}
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-heading text-lg font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.size ? (
            <span className="text-sm text-muted-foreground">
              {product.size} mL
            </span>
          ) : null}
        </div>

        <ProductBadges favorite={favorite} />

        <div className="flex flex-col gap-3 rounded-lg bg-muted/60 p-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Estado</span>
            <span className="font-medium">Guardado</span>
          </div>
          {favorite.favorite.notes ? (
            <p className="line-clamp-2 leading-5 text-muted-foreground">
              {favorite.favorite.notes}
            </p>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <HeartOff aria-hidden="true" className="size-4" />
              <span>Sin notas agregadas</span>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  )
}
