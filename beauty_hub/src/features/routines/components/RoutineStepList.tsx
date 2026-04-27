"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ChevronRightIcon } from "lucide-react"

import type { RoutineProduct } from "../types"

interface RoutineStepListProps {
  products: RoutineProduct[]
}

function formatPrice(price: number) {
  if (!Number.isFinite(price)) {
    return "Precio no disponible"
  }

  return new Intl.NumberFormat("es-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price)
}

export function RoutineStepList({ products }: RoutineStepListProps) {
  const sortedProducts = [...products].sort((left, right) => left.step - right.step)

  if (sortedProducts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background/60 p-5 text-sm text-muted-foreground">
        Esta rutina todavía no tiene productos. Agrega el primer paso para
        construir el flujo.
      </div>
    )
  }

  return (
    <div className="relative space-y-4 pl-4 before:absolute before:top-4 before:bottom-4 before:left-[31px] before:w-px before:bg-border">
      {sortedProducts.map((product) => (
        <div key={`${product.productId}-${product.step}`} className="relative pl-10">
          <div className="absolute top-4 left-0 z-10 flex size-8 items-center justify-center rounded-full border border-primary/30 bg-primary text-xs font-semibold text-primary-foreground shadow-sm">
            #{product.step}
          </div>

          <Link href={`/productos/${product.productId}`} className="block">
            <Card className="gap-0 border-border/70 bg-background/70 py-0 transition-colors hover:bg-secondary/40 focus-visible:ring-3 focus-visible:ring-ring/50">
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-base font-medium">
                      {product.name}
                    </h3>
                    <Badge variant={product.mandatory ? "secondary" : "outline"}>
                      {product.mandatory ? "Obligatorio" : "Opcional"}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {product.brand ?? "Marca no disponible"} ·{" "}
                    {formatPrice(product.price)}
                  </p>

                  {product.notes ? (
                    <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                      {product.notes}
                    </p>
                  ) : null}
                </div>

                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </div>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  )
}
