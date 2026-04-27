import type { TextListValue } from "../types"

export function toTextList(value?: TextListValue) {
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

export function splitTextList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

export function formatCurrency(value?: number | null) {
  if (!Number.isFinite(value ?? Number.NaN)) {
    return "No definido"
  }

  return new Intl.NumberFormat("es-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value ?? 0)
}

export function formatDate(value?: string | null) {
  return value || "No definido"
}
