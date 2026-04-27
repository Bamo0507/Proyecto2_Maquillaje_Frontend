"use client"

import { useState } from "react"
import {
  AlertCircleIcon,
  CalendarPlusIcon,
  RefreshCcwIcon,
  SparklesIcon,
} from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { useCurrentUsername } from "../hooks/useCurrentUsername"
import { useUserRoutines } from "../hooks/useUserRoutines"
import { CreateRoutineSheet } from "./CreateRoutineSheet"
import { RoutineCard } from "./RoutineCard"

function RoutinesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="gap-0 py-0">
          <CardHeader className="space-y-3 border-b border-border/60 p-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </CardHeader>
          <CardContent className="grid gap-3 p-4 md:grid-cols-3">
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
            <Skeleton className="h-10 rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function RoutinesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const username = useCurrentUsername()
  const routinesQuery = useUserRoutines(username)
  const routines = routinesQuery.data?.routines ?? []

  if (!username) {
    return (
      <div className="space-y-6 px-2 py-2 md:px-4 xl:px-8">
        <Alert variant="destructive">
          <AlertCircleIcon aria-hidden="true" />
          <AlertTitle>No encontramos tu usuario activo</AlertTitle>
          <AlertDescription>
            Inicia sesión nuevamente para cargar tus rutinas.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-2 py-2 md:px-4 xl:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Beauty Hub
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            Mis rutinas
          </h1>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Organiza tus productos en flujos claros por momento del día y sigue
            cada paso con notas propias.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              void routinesQuery.refetch()
            }}
            disabled={routinesQuery.isFetching}
          >
            <RefreshCcwIcon aria-hidden="true" data-icon="inline-start" />
            {routinesQuery.isFetching ? "Actualizando" : "Actualizar"}
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <CalendarPlusIcon aria-hidden="true" data-icon="inline-start" />
            Crear rutina
          </Button>
        </div>
      </div>

      <Separator />

      {routinesQuery.isLoading ? (
        <RoutinesSkeleton />
      ) : routinesQuery.error ? (
        <Alert variant="destructive">
          <AlertCircleIcon aria-hidden="true" />
          <AlertTitle>No pudimos cargar tus rutinas</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {routinesQuery.error.message ||
                "Intenta nuevamente en unos segundos."}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void routinesQuery.refetch()
              }}
            >
              Intentar de nuevo
            </Button>
          </AlertDescription>
        </Alert>
      ) : routines.length === 0 ? (
        <Card className="border-dashed border-border/80 bg-card/80">
          <CardContent className="flex flex-col items-start gap-4 p-6">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <SparklesIcon aria-hidden="true" className="size-5" />
            </div>
            <div className="space-y-1">
              <h2 className="font-heading text-xl font-semibold">
                Aún no tienes rutinas
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Crea una rutina vacía y luego agrega productos para formar tu
                flujo paso a paso.
              </p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)}>
              <CalendarPlusIcon aria-hidden="true" data-icon="inline-start" />
              Crear primera rutina
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {routines.map((routine) => (
            <RoutineCard
              key={routine.routineId}
              username={username}
              routine={routine}
            />
          ))}
        </div>
      )}

      <CreateRoutineSheet
        username={username}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  )
}
