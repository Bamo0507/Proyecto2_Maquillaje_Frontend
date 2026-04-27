"use client"

import type { KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { BadgeDollarSign, Crown, Leaf, ShieldCheck, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { PremiumProduct } from "../types"

type PremiumProductCardProps =
  | {
      type: "top-ranked"
      product: PremiumProduct
      rankPosition: number
    }
  | {
      type: "budget"
      product: PremiumProduct
      budget: number | null
    }

const premiumBadgeClassName = "bg-secondary text-secondary-foreground"

function formatPrice(price: number) {
  if (!Number.isFinite(price)) {
    return "X"
  }

  return `$${price.toFixed(2)}`
}

function ProductBadges({ product }: { product: PremiumProduct }) {
  return (
    <div className="flex flex-wrap gap-2">
      {product.isVegan ? (
        <Badge variant="secondary" className={premiumBadgeClassName}>
          <Leaf aria-hidden="true" data-icon="inline-start" />
          Vegano
        </Badge>
      ) : null}
      {product.isCrueltyFree ? (
        <Badge variant="secondary" className={premiumBadgeClassName}>
          <ShieldCheck aria-hidden="true" data-icon="inline-start" />
          Cruelty free
        </Badge>
      ) : null}
    </div>
  )
}

export function PremiumProductCard(props: PremiumProductCardProps) {
  const router = useRouter()
  const product = props.product
  const goToProductProfile = () => {
    router.push(`/productos/${product.productId}`)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      goToProductProfile()
    }
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
          {props.type === "top-ranked"
            ? product.brandName || "Producto destacado"
            : product.brand || "Dentro de tu presupuesto"}
        </CardDescription>
        <CardTitle className="line-clamp-2 min-h-10">{product.name}</CardTitle>
        <CardAction>
          <Badge variant="secondary" className={premiumBadgeClassName}>
            <Star aria-hidden="true" data-icon="inline-start" />
            {product.rating}
          </Badge>
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

        <ProductBadges product={product} />

        <div className="flex flex-col gap-2 rounded-lg bg-muted/60 p-3 text-sm">
          {props.type === "top-ranked" ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Posición</span>
                <span className="font-medium">#{props.rankPosition}</span>
              </div>
              <Badge variant="secondary" className={premiumBadgeClassName}>
                <Crown aria-hidden="true" data-icon="inline-start" />
                Mejor posicionado
              </Badge>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Presupuesto</span>
                <span className="font-medium">
                  {props.budget ? formatPrice(props.budget) : "No definido"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className={premiumBadgeClassName}>
                  <BadgeDollarSign aria-hidden="true" data-icon="inline-start" />
                  Se ajusta a tu presupuesto
                </Badge>
                {product.finish ? (
                  <Badge variant="secondary" className={premiumBadgeClassName}>
                    {product.finish}
                  </Badge>
                ) : null}
                {product.shade ? (
                  <Badge variant="secondary" className={premiumBadgeClassName}>
                    {product.shade}
                  </Badge>
                ) : null}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
