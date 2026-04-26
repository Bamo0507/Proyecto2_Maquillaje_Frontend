"use client"

import { AlertCircle, RefreshCcw, Route, Sparkles, Target } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { useGeneralRecommendations } from "../hooks/useGeneralRecommendations"
import { RecommendationProductCard } from "./RecommendationProductCard"
import { RecommendationSection } from "./RecommendationSection"

export function RecommendationsPage() {
  const {
    username,
    skinTypeQuery,
    skinConcernQuery,
    routineQuery,
    isFetching,
    refetchAll,
  } = useGeneralRecommendations()

  if (!username) {
    return (
      <div className="flex min-w-0 max-w-full flex-col gap-6 overflow-hidden px-2 py-2 md:px-4 xl:px-8">
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>No encontramos tu usuario activo</AlertTitle>
          <AlertDescription>
            Inicia sesión nuevamente para cargar tus recomendaciones
            personalizadas.
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
            Recomendaciones para ti
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Productos seleccionados según tu tipo de piel, tus preocupaciones y
            tus rutinas actuales.
          </p>
        </div>

        <Button onClick={refetchAll} disabled={isFetching}>
          <RefreshCcw aria-hidden="true" data-icon="inline-start" />
          {isFetching ? "Actualizando" : "Actualizar"}
        </Button>
      </div>

      <Separator />

      <RecommendationSection
        title="Según tu tipo de piel"
        description="Opciones que coinciden con las características principales de tu piel."
        icon={Sparkles}
        items={skinTypeQuery.data?.recommendations ?? []}
        isLoading={skinTypeQuery.isLoading}
        error={skinTypeQuery.error}
        emptyMessage="No encontramos productos asociados a tu tipo de piel por ahora."
        onRetry={() => {
          void skinTypeQuery.refetch()
        }}
        renderItem={(recommendation) => (
          <RecommendationProductCard
            key={`${recommendation.skinType}-${recommendation.product.productId}`}
            type="skin-type"
            recommendation={recommendation}
          />
        )}
      />

      <Separator />

      <RecommendationSection
        title="Según tus preocupaciones"
        description="Productos orientados a tratar los objetivos de cuidado que tienes registrados."
        icon={Target}
        items={skinConcernQuery.data?.recommendations ?? []}
        isLoading={skinConcernQuery.isLoading}
        error={skinConcernQuery.error}
        emptyMessage="No encontramos productos relacionados con tus preocupaciones de piel por ahora."
        onRetry={() => {
          void skinConcernQuery.refetch()
        }}
        renderItem={(recommendation) => (
          <RecommendationProductCard
            key={`${recommendation.skinConcern}-${recommendation.product.productId}`}
            type="skin-concern"
            recommendation={recommendation}
          />
        )}
      />

      <Separator />

      <RecommendationSection
        title="Basadas en tus rutinas"
        description="Alternativas similares a los productos que ya forman parte de tus rutinas."
        icon={Route}
        items={routineQuery.data?.recommendations ?? []}
        isLoading={routineQuery.isLoading}
        error={routineQuery.error}
        emptyMessage="No encontramos productos similares a tus rutinas por ahora."
        onRetry={() => {
          void routineQuery.refetch()
        }}
        renderItem={(recommendation) => (
          <RecommendationProductCard
            key={`${recommendation.routine.routineId}-${recommendation.product.productId}`}
            type="routine"
            recommendation={recommendation}
          />
        )}
      />
    </div>
  )
}
