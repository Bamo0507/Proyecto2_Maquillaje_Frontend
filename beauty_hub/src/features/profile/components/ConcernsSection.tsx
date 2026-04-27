"use client"

import { useState } from "react"
import { EditIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useDeleteConcern } from "../hooks/useProfileMutations"
import type { UserConcern } from "../types"
import { formatDate, toTextList } from "../utils/profile-formatters"
import { ConcernDialog } from "./ConcernDialog"

interface ConcernsSectionProps {
  username: string
  concerns: UserConcern[]
}

export function ConcernsSection({ username, concerns }: ConcernsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingConcern, setEditingConcern] = useState<UserConcern | null>(null)
  const deleteConcernMutation = useDeleteConcern(username)
  const canDeleteConcern = concerns.length > 1

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border/60 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Preocupaciones</CardTitle>
            <CardDescription>
              No se puede eliminar la última preocupación del perfil.
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditingConcern(null)
              setDialogOpen(true)
            }}
          >
            <PlusIcon aria-hidden="true" data-icon="inline-start" />
            Agregar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-4">
        {concerns.map((concern) => (
          <div
            key={concern.name}
            className="rounded-xl border border-border bg-background/70 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-heading font-medium">{concern.name}</h3>
                {concern.description ? (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {concern.description}
                  </p>
                ) : null}
              </div>
              <Badge variant={concern.isPrimary ? "secondary" : "outline"}>
                {concern.isPrimary ? "Principal" : "Secundaria"}
              </Badge>
            </div>

            <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <span>Severidad: {concern.severity ?? "No definida"}</span>
              <span>Desde: {formatDate(concern.since)}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {toTextList(concern.triggers).map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingConcern(concern)
                  setDialogOpen(true)
                }}
              >
                <EditIcon aria-hidden="true" data-icon="inline-start" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!canDeleteConcern || deleteConcernMutation.isPending}
                onClick={() => {
                  deleteConcernMutation.mutate(concern.name, {
                    onSuccess: () =>
                      toast.success("Preocupación eliminada correctamente"),
                    onError: (error) =>
                      toast.error(
                        error.message || "No pudimos eliminar la preocupación"
                      ),
                  })
                }}
              >
                <Trash2Icon aria-hidden="true" data-icon="inline-start" />
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <ConcernDialog
        username={username}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        concern={editingConcern}
      />
    </Card>
  )
}
