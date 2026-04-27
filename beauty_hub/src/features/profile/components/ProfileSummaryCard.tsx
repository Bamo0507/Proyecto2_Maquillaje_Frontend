import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { UserProfileResponse } from "../types"
import { formatCurrency, toTextList } from "../utils/profile-formatters"

interface ProfileSummaryCardProps {
  profile: UserProfileResponse
}

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  const preferences = toTextList(profile.user.preferences)

  return (
    <Card className="gap-0 overflow-hidden border-border/70 bg-card py-0 shadow-sm">
      <CardHeader className="border-b border-border/60 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={profile.user.isPremium ? "secondary" : "outline"}>
                {profile.user.isPremium ? "Premium" : "Usuario general"}
              </Badge>
              {profile.user.country ? (
                <Badge variant="outline">{profile.user.country}</Badge>
              ) : null}
            </div>
            <CardTitle className="mt-3 text-3xl">
              {profile.user.username}
            </CardTitle>
            <CardDescription className="mt-1">
              {profile.user.email ?? "Correo no disponible"}
            </CardDescription>
          </div>

          <div className="rounded-xl border border-border bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Presupuesto mensual</p>
            <p className="font-heading text-2xl font-semibold">
              {formatCurrency(profile.user.monthlyBudget)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-4 md:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">Edad</p>
          <p className="font-medium">
            {profile.user.age != null ? `${profile.user.age} años` : "No definida"}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-muted-foreground">Preferencias</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {preferences.length ? (
              preferences.map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Sin preferencias registradas
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
