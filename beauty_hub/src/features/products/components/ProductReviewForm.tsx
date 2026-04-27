"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  CheckIcon,
  MessageSquareTextIcon,
  StarIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react"

import { useCreateProductReview } from "../hooks/useCreateProductReview"

const reviewSchema = z.object({
  rating: z
    .string()
    .regex(/^[1-5]$/, "Selecciona una calificación entre 1 y 5"),
  wouldRecommend: z.enum(["yes", "no"]),
  comment: z
    .string()
    .max(500, "Máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

interface ProductReviewFormProps {
  productId: number
  username: string
  hasExistingReview: boolean
}

export function ProductReviewForm({
  productId,
  username,
  hasExistingReview,
}: ProductReviewFormProps) {
  const createReviewMutation = useCreateProductReview(productId)
  const isBlocked = !username || hasExistingReview

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: "5",
      wouldRecommend: "yes",
      comment: "",
    },
  })

  const handleSubmit = form.handleSubmit((values) => {
    createReviewMutation.mutate(
      {
        username,
        rating: Number(values.rating),
        wouldRecommend: values.wouldRecommend === "yes",
        comment: values.comment?.trim() || null,
      },
      {
        onSuccess: () => {
          toast.success("Review creada correctamente")
          form.reset({
            rating: "5",
            wouldRecommend: "yes",
            comment: "",
          })
        },
        onError: (error) => {
          toast.error(error.message || "No pudimos crear la review")
        },
      }
    )
  })

  return (
    <Card className="gap-0 border-border/70 bg-card py-0 shadow-sm">
      <CardHeader className="border-b border-border/60 px-4 py-5">
        <CardDescription className="flex items-center gap-2">
          <MessageSquareTextIcon aria-hidden="true" className="size-4" />
          Tu opinión
        </CardDescription>
        <CardTitle className="text-2xl">Dejar una review</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 px-4 py-5">
        {isBlocked ? (
          <Alert>
            <CheckIcon aria-hidden="true" />
            <AlertTitle>
              {!username
                ? "No encontramos tu usuario activo"
                : "Ya dejaste una review para este producto"}
            </AlertTitle>
            <AlertDescription>
              {!username
                ? "Vuelve a iniciar sesión para cargar tu perfil y dejar una review."
                : "No puedes crear otra review con el mismo usuario."}
            </AlertDescription>
          </Alert>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Label htmlFor="review-rating">Calificación</Label>
              <Controller
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <div
                    id="review-rating"
                    className="flex flex-wrap gap-2"
                    role="radiogroup"
                    aria-label="Calificación"
                  >
                    {["1", "2", "3", "4", "5"].map((value) => {
                      const isSelected = field.value === value

                      return (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => field.onChange(value)}
                          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-input bg-background text-muted-foreground transition-colors hover:bg-secondary/60 aria-checked:border-primary aria-checked:bg-primary aria-checked:text-primary-foreground"
                        >
                          <StarIcon
                            aria-hidden="true"
                            className="size-4 fill-current"
                          />
                          <span className="sr-only">{value} estrellas</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              />
              {form.formState.errors.rating ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.rating.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              <Label>¿Lo recomendarías?</Label>
              <Controller
                control={form.control}
                name="wouldRecommend"
                render={({ field }) => (
                  <div
                    className="grid grid-cols-2 gap-2"
                    role="radiogroup"
                    aria-label="Recomendación"
                  >
                    {[
                      {
                        value: "yes",
                        label: "Sí",
                        icon: ThumbsUpIcon,
                      },
                      {
                        value: "no",
                        label: "No",
                        icon: ThumbsDownIcon,
                      },
                    ].map((item) => {
                      const Icon = item.icon
                      const isSelected = field.value === item.value

                      return (
                        <button
                          key={item.value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => field.onChange(item.value)}
                          className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-secondary/60 aria-checked:border-primary aria-checked:bg-primary aria-checked:text-primary-foreground"
                        >
                          <Icon aria-hidden="true" className="size-4" />
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              />
              {form.formState.errors.wouldRecommend ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.wouldRecommend.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-3">
              <Label htmlFor="review-comment">Comentario</Label>
              <Controller
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <Textarea
                    id="review-comment"
                    placeholder="Cuenta cómo te fue con este producto..."
                    className="min-h-28"
                    {...field}
                  />
                )}
              />
              <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                <span>Opcional, hasta 500 caracteres.</span>
                <Badge variant="secondary">Usuario: {username}</Badge>
              </div>
            </div>

            <Button type="submit" disabled={createReviewMutation.isPending}>
              {createReviewMutation.isPending ? "Guardando..." : "Publicar review"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
