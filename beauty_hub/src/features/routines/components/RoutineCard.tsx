"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  PackageIcon,
  PlusIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

import type { TextListValue, UserRoutine } from "../types"
import { AddProductToRoutineSheet } from "./AddProductToRoutineSheet"
import { RoutineStepList } from "./RoutineStepList"

interface RoutineCardProps {
  username: string
  routine: UserRoutine
}

function toTextList(value?: TextListValue) {
  if (Array.isArray(value)) {
    return value
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim()
    return trimmedValue ? [trimmedValue] : []
  }

  return []
}

function formatTimeOfDay(value: string) {
  const normalizedValue = value.toLowerCase()

  if (normalizedValue.includes("morning") || normalizedValue.includes("mañana")) {
    return "Mañana"
  }

  if (normalizedValue.includes("night") || normalizedValue.includes("noche")) {
    return "Noche"
  }

  if (normalizedValue.includes("evening") || normalizedValue.includes("tarde")) {
    return "Tarde"
  }

  return value
}

export function RoutineCard({ username, routine }: RoutineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const concerns = toTextList(routine.targetConcerns)
  const productCount = routine.products.length

  return (
    <>
      <Card className="gap-0 overflow-hidden border-border/70 bg-card py-0 shadow-sm">
        <CardHeader className="border-b border-border/60 px-4 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {formatTimeOfDay(routine.timeOfDay)}
                </Badge>
                <Badge variant={routine.hasRoutine.isActive ? "outline" : "secondary"}>
                  {routine.hasRoutine.isActive ? "Activa" : "Inactiva"}
                </Badge>
              </div>

              <div className="space-y-1">
                <CardTitle className="text-2xl">{routine.name}</CardTitle>
                {routine.description ? (
                  <CardDescription className="max-w-3xl leading-6">
                    {routine.description}
                  </CardDescription>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {routine.skinFocus ? (
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/15 text-primary"
                  >
                    {routine.skinFocus}
                  </Badge>
                ) : null}
                {concerns.map((concern) => (
                  <Badge key={concern} variant="outline">
                    {concern}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
                <ClockIcon aria-hidden="true" className="size-4" />
                {routine.hasRoutine.frequency ?? "Frecuencia no definida"}
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
                <PackageIcon aria-hidden="true" className="size-4" />
                {productCount} producto{productCount === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          <div
            className={cn(
              "grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-300 ease-out",
              isExpanded
                ? "grid-rows-[1fr] translate-y-0 opacity-100"
                : "grid-rows-[0fr] -translate-y-2 opacity-0"
            )}
          >
            <div className="min-h-0">
              <RoutineStepList products={routine.products} />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              className="justify-start px-3 transition-colors hover:bg-primary/10 hover:text-primary"
              onClick={() => setIsExpanded((value) => !value)}
            >
              {isExpanded ? (
                <ChevronUpIcon aria-hidden="true" />
              ) : (
                <ChevronDownIcon aria-hidden="true" />
              )}
              {isExpanded ? "Ocultar pasos" : "Ver pasos"}
            </Button>

            <Button onClick={() => setIsAddProductOpen(true)}>
              <PlusIcon aria-hidden="true" data-icon="inline-start" />
              Agregar producto
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddProductToRoutineSheet
        username={username}
        routineId={routine.routineId}
        open={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        nextStep={productCount + 1}
      />
    </>
  )
}
