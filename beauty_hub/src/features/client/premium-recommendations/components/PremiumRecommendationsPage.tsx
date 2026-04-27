"use client"

import { AlertCircle, BadgeDollarSign, Crown, RefreshCcw } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { usePremiumRecommendations } from "../hooks/usePremiumRecommendations"
import { PremiumProductCard } from "./PremiumProductCard"
import { PremiumRecommendationSection } from "./PremiumRecommendationSection"

export function PremiumRecommendationsPage() {
  const {
    username,
    topRankedQuery,
    budgetQuery,
    isFetching,
    refetchAll,
  } = usePremiumRecommendations()

  if (!username) {
    return (
      <div className="flex min-w-0 max-w-full flex-col gap-6 overflow-hidden px-2 py-2 md:px-4 xl:px-8">
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>No encontramos tu usuario activo</AlertTitle>
          <AlertDescription>
            Inicia sesión nuevamente para cargar tus recomendaciones premium.
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
            Beauty Hub Premium
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Recomendaciones premium
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Descubre productos destacados por relevancia y opciones que se
            ajustan a tu presupuesto mensual.
          </p>
        </div>

        <Button onClick={refetchAll} disabled={isFetching}>
          <RefreshCcw aria-hidden="true" data-icon="inline-start" />
          {isFetching ? "Actualizando" : "Actualizar"}
        </Button>
      </div>

      <Separator />

      <PremiumRecommendationSection
        title="Productos mejor posicionados"
        description="Productos con mayor relevancia dentro del grafo de recomendaciones."
        icon={Crown}
        items={topRankedQuery.data?.products ?? []}
        isLoading={topRankedQuery.isLoading}
        error={topRankedQuery.error}
        emptyMessage="No encontramos productos destacados por ahora."
        onRetry={() => {
          void topRankedQuery.refetch()
        }}
        renderItem={(product, index) => (
          <PremiumProductCard
            key={`top-ranked-${product.productId}`}
            type="top-ranked"
            product={product}
            rankPosition={index + 1}
          />
        )}
      />

      <Separator />

      <PremiumRecommendationSection
        title="Dentro de tu presupuesto"
        description="Productos sugeridos según el presupuesto mensual registrado en tu perfil."
        icon={BadgeDollarSign}
        items={budgetQuery.data?.products ?? []}
        isLoading={budgetQuery.isLoading}
        error={budgetQuery.error}
        emptyMessage="No encontramos productos que se ajusten a tu presupuesto por ahora."
        onRetry={() => {
          void budgetQuery.refetch()
        }}
        renderItem={(product) => (
          <PremiumProductCard
            key={`budget-${product.productId}`}
            type="budget"
            product={product}
            budget={budgetQuery.data?.budget ?? null}
          />
        )}
      />
    </div>
  )
}
