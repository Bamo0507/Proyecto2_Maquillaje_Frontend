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

import { useDeleteSkinType } from "../hooks/useProfileMutations"
import type { UserSkinType } from "../types"
import { formatDate, toTextList } from "../utils/profile-formatters"
import { SkinTypeDialog } from "./SkinTypeDialog"

interface SkinTypesSectionProps {
  username: string
  skinTypes: UserSkinType[]
}

export function SkinTypesSection({ username, skinTypes }: SkinTypesSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSkinType, setEditingSkinType] = useState<UserSkinType | null>(null)
  const deleteSkinTypeMutation = useDeleteSkinType(username)
  const canDeleteSkinType = skinTypes.length > 1

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border/60 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Tipos de piel</CardTitle>
            <CardDescription>
              Mantén al menos un tipo de piel activo para las recomendaciones.
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditingSkinType(null)
              setDialogOpen(true)
            }}
          >
            <PlusIcon aria-hidden="true" data-icon="inline-start" />
            Agregar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-4">
        {skinTypes.map((skinType) => (
          <div
            key={skinType.name}
            className="rounded-xl border border-border bg-background/70 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-heading font-medium">{skinType.name}</h3>
                {skinType.description ? (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {skinType.description}
                  </p>
                ) : null}
              </div>
              <Badge variant="secondary">
                {skinType.selfDiagnosed ? "Autodiagnóstico" : "Confirmado"}
              </Badge>
            </div>

            <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <span>Área: {skinType.area ?? "No definida"}</span>
              <span>Sensibilidad: {skinType.sensitivity ?? "No definida"}</span>
              <span>Confirmado: {formatDate(skinType.confirmedAt)}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {toTextList(skinType.characteristics).map((item) => (
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
                  setEditingSkinType(skinType)
                  setDialogOpen(true)
                }}
              >
                <EditIcon aria-hidden="true" data-icon="inline-start" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!canDeleteSkinType || deleteSkinTypeMutation.isPending}
                onClick={() => {
                  deleteSkinTypeMutation.mutate(skinType.name, {
                    onSuccess: () =>
                      toast.success("Tipo de piel eliminado correctamente"),
                    onError: (error) =>
                      toast.error(
                        error.message || "No pudimos eliminar el tipo de piel"
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

      <SkinTypeDialog
        username={username}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        skinType={editingSkinType}
      />
    </Card>
  )
}
