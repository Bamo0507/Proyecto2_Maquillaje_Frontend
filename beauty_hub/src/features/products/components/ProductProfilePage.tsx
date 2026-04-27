"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format, isValid, parseISO } from "date-fns"
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronRightIcon,
  FlaskConicalIcon,
  LeafIcon,
  StarIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { useCurrentUsername } from "../hooks/useCurrentUsername"
import { useProductDetail } from "../hooks/useProductDetail"
import { useProductReviews } from "../hooks/useProductReviews"
import { useSimilarProducts } from "../hooks/useSimilarProducts"
import type {
  ProductIngredient,
  ProductReview,
  SimilarProduct,
  TextListValue,
} from "../types"
import { ProductFavoriteButton } from "./ProductFavoriteButton"
import { ProductReviewForm } from "./ProductReviewForm"

interface ProductProfilePageProps {
  productId: string
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

function formatDate(value?: string | null) {
  if (!value) {
    return "Fecha no disponible"
  }

  const parsedDate = parseISO(value)

  if (!isValid(parsedDate)) {
    return value
  }

  return format(parsedDate, "d 'de' MMMM, yyyy")
}

function formatEfficacyScore(score?: number | null) {
  if (!Number.isFinite(score ?? Number.NaN)) {
    return "Sin puntaje"
  }

  return `${Math.round((score ?? 0) * 10)}%`
}

function formatBoolean(value?: boolean | null) {
  if (value === true) {
    return "Sí"
  }

  if (value === false) {
    return "No"
  }

  return "No disponible"
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

function ProductStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/60 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

function ReviewRow({
  review,
  isMine,
}: {
  review: ProductReview
  isMine: boolean
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{review.username}</p>
            {isMine ? <Badge variant="secondary">Tu review</Badge> : null}
            {review.wouldRecommend != null ? (
              <Badge variant="outline">
                {review.wouldRecommend ? "Recomienda" : "No recomienda"}
              </Badge>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(review.reviewDate)}
          </p>
        </div>

        <Badge className="bg-secondary text-secondary-foreground">
          <StarIcon aria-hidden="true" data-icon="inline-start" />
          {review.rating}
        </Badge>
      </div>

      {review.comment ? (
        <p className="mt-3 leading-6 text-foreground/90">{review.comment}</p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Esta review no incluye comentario.
        </p>
      )}
    </div>
  )
}

function SimilarProductCard({
  product,
}: {
  product: SimilarProduct
}) {
  return (
    <Link href={`/productos/${product.productId}`} className="block h-full">
      <Card className="h-full transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader>
          <CardDescription>Producto similar</CardDescription>
          <CardTitle className="line-clamp-2 min-h-12">{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <span className="font-heading text-lg font-semibold">
                {formatPrice(product.price)}
              </span>
              <p className="truncate text-sm text-muted-foreground">
                {product.brand ?? "Marca no disponible"}
              </p>
            </div>
            <ChevronRightIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function IngredientCard({
  ingredient,
}: {
  ingredient: ProductIngredient
}) {
  const benefits = toTextList(ingredient.benefits)
  const warnings = toTextList(ingredient.warnings)

  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-medium">{ingredient.name}</h3>
        {ingredient.relationship.isKeyIngredient ? (
          <Badge variant="secondary">Clave</Badge>
        ) : null}
      </div>

      <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
        <p>
          Concentración: <span className="text-foreground">{ingredient.concentration ?? "No disponible"}</span>
        </p>
        <p>
          Posición: <span className="text-foreground">{ingredient.relationship.position}</span>
        </p>
        <p>
          Porcentaje: <span className="text-foreground">{ingredient.relationship.percentage ?? "No disponible"}</span>
        </p>
        <p>
          Propósito: <span className="text-foreground">{ingredient.relationship.purpose ?? "No disponible"}</span>
        </p>
        <p>
          pH óptimo: <span className="text-foreground">{ingredient.phOptimal ?? "No disponible"}</span>
        </p>
      </div>

      {benefits.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {benefits.map((benefit) => (
            <Badge key={benefit} variant="outline">
              {benefit}
            </Badge>
          ))}
        </div>
      ) : null}

      {warnings.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {warnings.map((warning) => (
            <Badge key={warning} variant="secondary">
              {warning}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-background/60 p-6 text-sm text-muted-foreground">
      {message}
    </div>
  )
}

function ProductSectionCard({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <Card className="border-border/70 bg-card/80 shadow-sm backdrop-blur">
      <CardHeader className="border-b border-border/60">
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-4 py-6">{children}</CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 px-2 py-2 md:px-4 xl:px-8">
      <Skeleton className="h-10 w-44" />
      <Skeleton className="h-56 w-full rounded-3xl" />
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-80 w-full rounded-3xl" />
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-3xl" />
      <Skeleton className="h-72 w-full rounded-3xl" />
      <Skeleton className="h-80 w-full rounded-3xl" />
    </div>
  )
}

export function ProductProfilePage({ productId }: ProductProfilePageProps) {
  const router = useRouter()
  const username = useCurrentUsername()
  const numericProductId = Number(productId)
  const isValidProductId = Number.isInteger(numericProductId) && numericProductId > 0

  const productDetailQuery = useProductDetail(
    numericProductId,
    username,
    isValidProductId
  )
  const productReviewsQuery = useProductReviews(numericProductId, isValidProductId)
  const similarProductsQuery = useSimilarProducts(numericProductId, isValidProductId)

  const product = productDetailQuery.data?.product
  const brand = productDetailQuery.data?.brand
  const categories = productDetailQuery.data?.categories ?? []
  const ingredients = productDetailQuery.data?.ingredients ?? []
  const skinTypes = productDetailQuery.data?.skinTypes ?? []
  const skinConcerns = productDetailQuery.data?.skinConcerns ?? []
  const reviews = productReviewsQuery.data?.reviews ?? []
  const similarProducts = similarProductsQuery.data?.products ?? []

  const currentUserReview = reviews.find((review) => review.username === username)

  const hasExistingReview = Boolean(currentUserReview)
  const reviewCount = productReviewsQuery.data?.total ?? reviews.length

  if (!isValidProductId) {
    return (
      <div className="space-y-6 px-2 py-2 md:px-4 xl:px-8">
        <Alert variant="destructive">
          <ShieldCheckIcon aria-hidden="true" />
          <AlertTitle>Id de producto inválido</AlertTitle>
          <AlertDescription>
            No pudimos interpretar el identificador del producto.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (
    productDetailQuery.isLoading ||
    productReviewsQuery.isLoading ||
    similarProductsQuery.isLoading
  ) {
    return <LoadingSkeleton />
  }

  if (productDetailQuery.error || productReviewsQuery.error || similarProductsQuery.error) {
    const error =
      productDetailQuery.error ||
      productReviewsQuery.error ||
      similarProductsQuery.error

    return (
      <div className="space-y-6 px-2 py-2 md:px-4 xl:px-8">
        <Alert variant="destructive">
          <SparklesIcon aria-hidden="true" />
          <AlertTitle>No pudimos cargar el perfil del producto</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Intenta nuevamente en unos segundos."}
          </AlertDescription>
        </Alert>

        <Button
          variant="outline"
          onClick={() => {
            void productDetailQuery.refetch()
            void productReviewsQuery.refetch()
            void similarProductsQuery.refetch()
          }}
        >
          Reintentar
        </Button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-6 px-2 py-2 md:px-4 xl:px-8">
        <Alert>
          <ShieldCheckIcon aria-hidden="true" />
          <AlertTitle>Producto no encontrado</AlertTitle>
          <AlertDescription>
            No encontramos información para este producto.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.back()}>
          Volver
        </Button>
      </div>
    )
  }

  const productTags = toTextList(product.tags)
  const brandCertifications = toTextList(brand?.certifications)
  const primaryCategory = categories[0]?.name

  return (
    <div className="space-y-6 px-2 py-2 md:px-4 xl:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="px-0 hover:bg-transparent"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon aria-hidden="true" />
          Volver
        </Button>

        <p className="text-sm text-muted-foreground">
          {reviewCount} review{reviewCount === 1 ? "" : "s"}
        </p>
      </div>

      <Card className="relative gap-0 overflow-hidden border-border/70 bg-card py-0 shadow-sm">
        <CardHeader className="border-b border-border/60 bg-card px-4 py-5 md:px-6">
          <div className="flex max-w-5xl flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="w-fit">
                  Perfil de producto
                </Badge>
                {primaryCategory ? (
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/15 text-primary"
                  >
                    {primaryCategory}
                  </Badge>
                ) : null}
              </div>
              <CardTitle className="text-3xl leading-tight md:text-4xl">
                {product.name}
              </CardTitle>
              <CardDescription className="text-base leading-7">
                {product.description}
              </CardDescription>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="font-heading text-2xl font-semibold">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {product.size ? `${product.size} ml` : "Tamaño no disponible"}
                </span>
                <Badge className="bg-secondary text-secondary-foreground">
                  <StarIcon aria-hidden="true" data-icon="inline-start" />
                  {product.rating}
                </Badge>
                {product.isVegan ? (
                  <Badge variant="outline">
                    <LeafIcon aria-hidden="true" data-icon="inline-start" />
                    Vegano
                  </Badge>
                ) : null}
                {product.isCrueltyFree ? (
                  <Badge variant="outline">
                    <ShieldCheckIcon aria-hidden="true" data-icon="inline-start" />
                    Cruelty free
                  </Badge>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {productTags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 p-4 md:grid-cols-3">
          <ProductStat label="Lanzamiento" value={formatDate(product.launchDate)} />
          <ProductStat label="Acabado" value={product.finish ?? "No disponible"} />
          <ProductStat label="Tono" value={product.shade ?? "No disponible"} />
        </CardContent>

        <ProductFavoriteButton
          productId={numericProductId}
          username={username}
          favorite={productDetailQuery.data?.favorite}
        />
      </Card>

      <div>
        <ProductSectionCard
          title="Información de la marca"
          description="Datos asociados al fabricante y su posicionamiento."
        >
          {brand ? (
            <div className="grid gap-4 md:grid-cols-2">
              <ProductStat label="Marca" value={brand.name} />
              <ProductStat label="País" value={brand.country ?? "No disponible"} />
              <ProductStat
                label="Año de fundación"
                value={brand.foundedYear ? `${brand.foundedYear}` : "No disponible"}
              />
              <ProductStat
                label="Lujo"
                value={formatBoolean(brand.isLuxury)}
              />
            </div>
          ) : (
            <EmptyState message="No encontramos información de la marca para este producto." />
          )}

          {brand?.description ? (
            <p className="leading-7 text-muted-foreground">{brand.description}</p>
          ) : null}

          {brandCertifications.length ? (
            <div className="flex flex-wrap gap-2">
              {brandCertifications.map((certification) => (
                <Badge key={certification} variant="secondary">
                  {certification}
                </Badge>
              ))}
            </div>
          ) : null}
        </ProductSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ProductSectionCard
          title="Ingredientes"
          description="Lista completa con el papel de cada componente."
        >
          {ingredients.length ? (
            <div className="grid gap-4">
              {ingredients.map((ingredient) => (
                <IngredientCard key={`${ingredient.name}-${ingredient.relationship.position}`} ingredient={ingredient} />
              ))}
            </div>
          ) : (
            <EmptyState message="No encontramos ingredientes para este producto." />
          )}
        </ProductSectionCard>

        <div className="space-y-6">
          <ProductSectionCard
            title="Tipos de piel"
            description="Ajuste estimado según las relaciones del backend."
          >
            {skinTypes.length ? (
              <div className="grid gap-4">
                {skinTypes.map((skinType) => {
                  const characteristics = toTextList(skinType.characteristics)
                  const recommendedRoutine = toTextList(
                    skinType.recommendedRoutine
                  )

                  return (
                    <div
                      key={skinType.name}
                      className="rounded-2xl border border-border/70 bg-background/70 p-4"
                    >
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                        <div className="min-w-0">
                          <h3 className="font-medium">{skinType.name}</h3>
                          {skinType.description ? (
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {skinType.description}
                            </p>
                          ) : null}
                        </div>
                        {skinType.relationship.dermatologistApproved ? (
                          <Badge variant="secondary">
                            <CheckIcon aria-hidden="true" data-icon="inline-start" />
                            Aprobado
                          </Badge>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <ProductStat
                          label="Eficacia"
                          value={formatEfficacyScore(
                            skinType.relationship.efficacyScore
                          )}
                        />
                        <ProductStat
                          label="Notas"
                          value={skinType.relationship.notes ?? "No disponibles"}
                        />
                      </div>

                      {characteristics.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {characteristics.map((characteristic) => (
                            <Badge key={characteristic} variant="outline">
                              {characteristic}
                            </Badge>
                          ))}
                        </div>
                      ) : null}

                      {recommendedRoutine.length ? (
                        <div className="mt-4 text-sm text-muted-foreground">
                          <p className="font-medium text-foreground">
                            Rutina recomendada
                          </p>
                          <p>{recommendedRoutine.join(" · ")}</p>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState message="No hay tipos de piel asociados." />
            )}
          </ProductSectionCard>

          <ProductSectionCard
            title="Preocupaciones de piel"
            description="Objetivos y problemas de piel que este producto intenta cubrir."
          >
            {skinConcerns.length ? (
              <div className="grid gap-4">
                {skinConcerns.map((skinConcern) => {
                  const triggers = toTextList(skinConcern.triggers)
                  const recommendedIngredients = toTextList(
                    skinConcern.recommendedIngredients
                  )

                  return (
                    <div
                      key={skinConcern.name}
                      className="rounded-2xl border border-border/70 bg-background/70 p-4"
                    >
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                        <div className="min-w-0">
                          <h3 className="font-medium">{skinConcern.name}</h3>
                          {skinConcern.description ? (
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {skinConcern.description}
                            </p>
                          ) : null}
                        </div>
                        {skinConcern.relationship.clinicallyTested ? (
                          <Badge variant="secondary">
                            <FlaskConicalIcon aria-hidden="true" data-icon="inline-start" />
                            Clínicamente probado
                          </Badge>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <ProductStat
                          label="Eficacia"
                          value={formatEfficacyScore(
                            skinConcern.relationship.efficacyScore
                          )}
                        />
                        <ProductStat
                          label="Tiempo estimado"
                          value={
                            skinConcern.relationship.resultsTimeWeeks
                              ? `${skinConcern.relationship.resultsTimeWeeks} semanas`
                              : "No disponible"
                          }
                        />
                      </div>

                      {triggers.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {triggers.map((trigger) => (
                            <Badge key={trigger} variant="outline">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      ) : null}

                      {recommendedIngredients.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {recommendedIngredients.map((recommendedIngredient) => (
                            <Badge key={recommendedIngredient} variant="secondary">
                              {recommendedIngredient}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState message="No hay preocupaciones de piel asociadas." />
            )}
          </ProductSectionCard>
        </div>
      </div>

      <ProductSectionCard
        title="Reviews"
        description="Opiniones de personas que ya probaron este producto."
      >
        {reviews.length ? (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <ReviewRow
                key={`${review.username}-${review.reviewDate ?? review.rating}`}
                review={review}
                isMine={review.username === username}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="Todavía no hay reviews para este producto." />
        )}
      </ProductSectionCard>

      <ProductSectionCard
        title="Productos similares"
        description="Otras opciones relacionadas con esta ficha."
      >
        {similarProducts.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {similarProducts.map((similarProduct) => (
              <SimilarProductCard
                key={similarProduct.productId}
                product={similarProduct}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="No encontramos productos similares por ahora." />
        )}
      </ProductSectionCard>

      <ProductReviewForm
        productId={numericProductId}
        username={username}
        hasExistingReview={hasExistingReview}
      />
    </div>
  )
}
