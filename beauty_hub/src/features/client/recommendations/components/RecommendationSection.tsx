"use client"

import { useCallback, useEffect, useState, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"

interface RecommendationSectionProps<TItem> {
  title: string
  description: string
  icon: LucideIcon
  items: TItem[]
  isLoading: boolean
  error: Error | null
  emptyMessage: string
  onRetry: () => void
  renderItem: (item: TItem) => ReactNode
}

function RecommendationSectionSkeleton() {
  return (
    <Carousel
      opts={{ align: "start", containScroll: "trimSnaps" }}
      className="min-w-0 max-w-full overflow-visible py-2"
    >
      <CarouselContent className="overflow-visible py-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="min-w-0 basis-full px-1 sm:basis-1/2 xl:basis-1/3"
          >
            <Card className="h-full min-w-0">
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-3/4" />
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-7 w-32" />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export function RecommendationSection<TItem>({
  title,
  description,
  icon: Icon,
  items,
  isLoading,
  error,
  emptyMessage,
  onRetry,
  renderItem,
}: RecommendationSectionProps<TItem>) {
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateControls = useCallback((carouselApi: CarouselApi) => {
    if (!carouselApi) {
      return
    }

    setCanScrollPrev(carouselApi.canScrollPrev())
    setCanScrollNext(carouselApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }

    queueMicrotask(() => {
      updateControls(api)
    })

    api.on("reInit", updateControls)
    api.on("select", updateControls)

    return () => {
      api.off("reInit", updateControls)
      api.off("select", updateControls)
    }
  }, [api, updateControls])

  return (
    <section className="flex min-w-0 max-w-full flex-col gap-4 overflow-visible">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon aria-hidden="true" className="size-5" />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              {title}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {items.length > 0 && !isLoading && !error ? (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => api?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Ver recomendación anterior"
            >
              <ChevronLeft aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => api?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Ver recomendación siguiente"
            >
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <RecommendationSectionSkeleton />
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>No se pudo cargar esta sección</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error.message || "Intenta nuevamente en unos segundos."}</span>
            <Button variant="outline" size="sm" onClick={onRetry}>
              Intentar de nuevo
            </Button>
          </AlertDescription>
        </Alert>
      ) : items.length === 0 ? (
        <Alert>
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Sin recomendaciones disponibles</AlertTitle>
          <AlertDescription>{emptyMessage}</AlertDescription>
        </Alert>
      ) : (
        <Carousel
          opts={{ align: "start", containScroll: "trimSnaps" }}
          setApi={setApi}
          className="min-w-0 max-w-full overflow-visible py-2"
        >
          <CarouselContent className="overflow-visible py-2">
            {items.map((item, index) => (
              <CarouselItem
                key={index}
                className="min-w-0 basis-full px-1 sm:basis-1/2 xl:basis-1/3"
              >
                {renderItem(item)}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </section>
  )
}
