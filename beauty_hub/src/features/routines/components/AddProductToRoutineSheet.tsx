"use client"

import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PackagePlusIcon, SearchIcon } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { useAddProductToRoutine } from "../hooks/useAddProductToRoutine"
import { useCategories } from "../hooks/useCategories"
import { useProductsSearch } from "../hooks/useProductsSearch"
import type { SearchProduct, TextListValue } from "../types"

const addProductSchema = z.object({
  notes: z.string().optional(),
  mandatory: z.boolean(),
})

type AddProductFormValues = z.input<typeof addProductSchema>

interface AddProductToRoutineSheetProps {
  username: string
  routineId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  nextStep: number
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

function ProductOption({
  product,
  selected,
  onSelect,
}: {
  product: SearchProduct
  selected: boolean
  onSelect: () => void
}) {
  const categories = toTextList(product.categories)

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "m-1 w-[calc(100%-0.5rem)] rounded-xl border bg-background/70 p-3 text-left transition-colors focus-visible:ring-3 focus-visible:ring-ring/40",
        selected
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border hover:bg-secondary/50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="font-medium leading-snug">{product.name}</p>
          <p className="text-sm text-muted-foreground">
            {product.brand ?? "Marca no disponible"} · {formatPrice(product.price)}
          </p>
        </div>
        {selected ? <Badge>Seleccionado</Badge> : null}
      </div>
      {categories.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.slice(0, 3).map((category) => (
            <Badge key={category} variant="outline">
              {category}
            </Badge>
          ))}
        </div>
      ) : null}
    </button>
  )
}

export function AddProductToRoutineSheet({
  username,
  routineId,
  open,
  onOpenChange,
  nextStep,
}: AddProductToRoutineSheetProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<SearchProduct | null>(
    null
  )

  const categoriesQuery = useCategories()
  const productsQuery = useProductsSearch({ search, category })
  const addProductMutation = useAddProductToRoutine(username, routineId)
  const categories = categoriesQuery.data?.categories ?? []
  const products = productsQuery.data?.products ?? []

  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    values: {
      notes: "",
      mandatory: true,
    },
  })

  const selectedProductLabel = useMemo(() => {
    if (!selectedProduct) {
      return "Ningún producto seleccionado"
    }

    return selectedProduct.name
  }, [selectedProduct])

  const handleSubmit = form.handleSubmit((values) => {
    if (!selectedProduct) {
      toast.error("Selecciona un producto")
      return
    }

    addProductMutation.mutate(
      {
        productId: selectedProduct.productId,
        step: nextStep,
        notes: values.notes?.trim() || null,
        mandatory: values.mandatory,
      },
      {
        onSuccess: () => {
          toast.success("Producto agregado a la rutina")
          setSelectedProduct(null)
          setSearch("")
          setCategory("")
          form.reset({
            notes: "",
            mandatory: true,
          })
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(error.message || "No pudimos agregar el producto")
        },
      }
    )
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <PackagePlusIcon aria-hidden="true" className="size-4" />
            Agregar producto
          </SheetTitle>
          <SheetDescription>
            Busca un producto, define su paso y agrégalo al flujo de la rutina.
          </SheetDescription>
        </SheetHeader>

        <form className="flex flex-1 flex-col gap-5 px-4" onSubmit={handleSubmit}>
          <div className="grid items-start gap-3 sm:grid-cols-[1fr_190px]">
            <div className="flex flex-col gap-2">
              <Label htmlFor="product-search">Buscar producto</Label>
              <div className="relative">
                <SearchIcon
                  aria-hidden="true"
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="product-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nombre del producto"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="product-category">Categoría</Label>
              <Select
                value={category || "all"}
                onValueChange={(value) =>
                  setCategory(value === "all" ? "" : value)
                }
              >
                <SelectTrigger id="product-category" className="h-10 w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((item) => (
                      <SelectItem key={item.name} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Productos</Label>
              <span className="text-xs text-muted-foreground">
                {productsQuery.data?.total ?? 0} resultados
              </span>
            </div>
            <div className="relative">
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1 pb-8">
                {productsQuery.isLoading ? (
                  <>
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </>
                ) : products.length ? (
                  products.map((product) => (
                    <ProductOption
                      key={product.productId}
                      product={product}
                      selected={selectedProduct?.productId === product.productId}
                      onSelect={() => setSelectedProduct(product)}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                    No encontramos productos con esos filtros.
                  </div>
                )}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-popover to-transparent" />
            </div>
          </div>

          <Separator />

          <div className="rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-muted-foreground">
            Producto: <span className="text-foreground">{selectedProductLabel}</span>
          </div>

          <div className="grid items-start gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Paso</Label>
              <div className="flex h-10 items-center rounded-lg border border-border bg-background/70 px-3 text-sm text-muted-foreground">
                Paso asignado:{" "}
                <span className="ml-1 font-medium text-foreground">
                  #{nextStep}
                </span>
              </div>
            </div>

            <Controller
              control={form.control}
              name="mandatory"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label>Tipo de paso</Label>
                  <label className="flex h-10 cursor-pointer items-center gap-3 rounded-lg border border-border bg-background/70 px-3 text-sm">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      className="size-4 accent-primary"
                    />
                    Obligatorio
                  </label>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="routine-product-notes">Notas</Label>
            <Controller
              control={form.control}
              name="notes"
              render={({ field }) => (
                <Textarea
                  id="routine-product-notes"
                  placeholder="Indicaciones para este paso..."
                  className="min-h-24"
                  {...field}
                />
              )}
            />
          </div>

          <SheetFooter className="px-0">
            <Button
              type="submit"
              className="h-11 px-6"
              disabled={addProductMutation.isPending}
            >
              {addProductMutation.isPending
                ? "Agregando..."
                : "Agregar producto"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
