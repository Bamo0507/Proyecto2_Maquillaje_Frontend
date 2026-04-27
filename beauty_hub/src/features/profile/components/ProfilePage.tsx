"use client"

import { useState } from "react"
import { AlertCircleIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCurrentUsername } from "@/hooks/use-current-username"

import { useUserProfile } from "../hooks/useUserProfile"
import { ConcernsSection } from "./ConcernsSection"
import { ProfileEditSheet } from "./ProfileEditSheet"
import { ProfileHeader } from "./ProfileHeader"
import { ProfileSkeleton } from "./ProfileSkeleton"
import { ProfileStatsGrid } from "./ProfileStatsGrid"
import { ProfileSummaryCard } from "./ProfileSummaryCard"
import { SkinTypesSection } from "./SkinTypesSection"

export function ProfilePage() {
  const [editOpen, setEditOpen] = useState(false)
  const username = useCurrentUsername()
  const profileQuery = useUserProfile(username)
  const profile = profileQuery.data

  if (!username) {
    return (
      <div className="flex flex-col gap-6 px-2 py-2 md:px-4 xl:px-8">
        <Alert variant="destructive">
          <AlertCircleIcon aria-hidden="true" />
          <AlertTitle>No encontramos tu usuario activo</AlertTitle>
          <AlertDescription>
            Inicia sesión nuevamente para cargar tu perfil.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (profileQuery.isLoading) {
    return <ProfileSkeleton />
  }

  if (profileQuery.error || !profile) {
    return (
      <div className="flex flex-col gap-6 px-2 py-2 md:px-4 xl:px-8">
        <Alert variant="destructive">
          <AlertCircleIcon aria-hidden="true" />
          <AlertTitle>No pudimos cargar tu perfil</AlertTitle>
          <AlertDescription>
            {profileQuery.error?.message || "Intenta nuevamente en unos segundos."}
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => {
            void profileQuery.refetch()
          }}
        >
          Intentar de nuevo
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-2 py-2 md:px-4 xl:px-8">
      <ProfileHeader
        isFetching={profileQuery.isFetching}
        onEdit={() => setEditOpen(true)}
        onRefresh={() => {
          void profileQuery.refetch()
        }}
      />

      <ProfileSummaryCard profile={profile} />
      <ProfileStatsGrid stats={profile.stats} />

      <Separator />

      <div className="grid gap-6 xl:grid-cols-2">
        <SkinTypesSection username={username} skinTypes={profile.skinTypes} />
        <ConcernsSection username={username} concerns={profile.concerns} />
      </div>

      <ProfileEditSheet
        username={username}
        profile={profile}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  )
}
