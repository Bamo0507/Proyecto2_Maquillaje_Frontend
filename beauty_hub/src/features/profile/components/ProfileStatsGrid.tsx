import type { LucideIcon } from "lucide-react"
import { CalendarIcon, HeartIcon, StarIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

import type { UserProfileStats } from "../types"

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-heading text-xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface ProfileStatsGridProps {
  stats: UserProfileStats
}

export function ProfileStatsGrid({ stats }: ProfileStatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard label="Reviews" value={`${stats.totalReviews}`} icon={StarIcon} />
      <StatCard
        label="Rating promedio"
        value={`${Number(stats.averageRating).toFixed(1)}`}
        icon={StarIcon}
      />
      <StatCard label="Favoritos" value={`${stats.totalFavorites}`} icon={HeartIcon} />
      <StatCard label="Rutinas" value={`${stats.totalRoutines}`} icon={CalendarIcon} />
    </div>
  )
}
