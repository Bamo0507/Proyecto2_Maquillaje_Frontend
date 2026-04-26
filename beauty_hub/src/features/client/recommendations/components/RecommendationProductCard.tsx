"use client"

import type { KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, FlaskConical, Leaf, ShieldCheck, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type {
  RecommendedProduct,
  RoutineRecommendation,
  SkinConcernRecommendation,
  SkinTypeRecommendation,
} from "../types"

type RecommendationProductCardProps =
  | {
      type: "skin-type"
      recommendation: SkinTypeRecommendation
    }
  | {
      type: "skin-concern"
      recommendation: SkinConcernRecommendation
    }
  | {
      type: "routine"
      recommendation: RoutineRecommendation
    }

const recommendationBadgeClassName = "bg-secondary text-secondary-foreground"

function formatPrice(price: number) {
  if (!Number.isFinite(price)) {
    return "Precio no disponible"
  }

  return `$${price.toFixed(2)}`
}

function formatRecommendationScore(score: number) {
  if (!Number.isFinite(score)) {
    return "Sin puntaje"
  }

  const normalizedScore = score <= 1 ? score * 100 : score
  return `${Math.round(normalizedScore * 10)}%`
}

function formatSimilarityScore(score: number) {
  if (!Number.isFinite(score)) {
    return "Sin puntaje"
  }

  const normalizedScore = score <= 1 ? score * 100 : score
  return `${Math.round(normalizedScore)}%`
}

function ProductBadges({ product }: { product: RecommendedProduct }) {
  return (
    <div className="flex flex-wrap gap-2">
      {product.isVegan ? (
        <Badge variant="secondary" className={recommendationBadgeClassName}>
          <Leaf aria-hidden="true" data-icon="inline-start" />
          Vegano
        </Badge>
      ) : null}
      {product.isCrueltyFree ? (
        <Badge variant="secondary" className={recommendationBadgeClassName}>
          <ShieldCheck aria-hidden="true" data-icon="inline-start" />
          Cruelty free
        </Badge>
      ) : null}
    </div>
  )
}

export function RecommendationProductCard({
  type,
  recommendation,
}: RecommendationProductCardProps) {
  const router = useRouter()
  const product = recommendation.product
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
          {type === "skin-type" ? recommendation.skinType : null}
          {type === "skin-concern" ? recommendation.skinConcern : null}
          {type === "routine" ? recommendation.routine.name : null}
        </CardDescription>
        <CardTitle className="line-clamp-2 min-h-10">{product.name}</CardTitle>
        <CardAction>
          <Badge variant="secondary" className={recommendationBadgeClassName}>
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
          {type === "skin-type" ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Eficacia</span>
                <span className="font-medium">
                  {formatRecommendationScore(
                    recommendation.suitability.efficacyScore
                  )}
                </span>
              </div>
              {recommendation.suitability.dermatologistApproved ? (
                <Badge variant="secondary" className={recommendationBadgeClassName}>
                  <CheckCircle2 aria-hidden="true" data-icon="inline-start" />
                  Aprobado por dermatólogo
                </Badge>
              ) : null}
            </>
          ) : null}

          {type === "skin-concern" ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Eficacia</span>
                <span className="font-medium">
                  {formatRecommendationScore(
                    recommendation.targeting.efficacyScore
                  )}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendation.targeting.clinicallyTested ? (
                  <Badge
                    variant="secondary"
                    className={recommendationBadgeClassName}
                  >
                    <FlaskConical aria-hidden="true" data-icon="inline-start" />
                    Probado clínicamente
                  </Badge>
                ) : null}
                <Badge
                  variant="secondary"
                  className={recommendationBadgeClassName}
                >
                  Resultados en {recommendation.targeting.resultsTimeWeeks} semanas
                </Badge>
              </div>
            </>
          ) : null}

          {type === "routine" ? (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Similitud</span>
                <span className="font-medium">
                  {formatSimilarityScore(
                    recommendation.similarity.similarityScore
                  )}
                </span>
              </div>
              <p className="leading-5 text-muted-foreground">
                Basado en {recommendation.basedOnProduct.name}
              </p>
              <Badge
                variant="secondary"
                className={recommendationBadgeClassName}
              >
                Ingredientes compartidos:{" "}
                {recommendation.similarity.sharedIngredients}
              </Badge>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
