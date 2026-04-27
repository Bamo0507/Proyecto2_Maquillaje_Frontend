"use client"

import { useMemo, useState } from "react"
import {
  AlertCircleIcon,
  CrownIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import {
  useDeleteAdminUser,
  useDeleteAdminUserMonthlyBudget,
  useDeleteAdminUsersBulk,
  useDeleteAdminUsersMonthlyBudget,
  useUpdateAdminUsersPremium,
} from "../hooks/useAdminUserMutations"
import { useAdminUsers } from "../hooks/useAdminUsers"
import type { AdminUser } from "../types"
import { BudgetDialog } from "./BudgetDialog"
import {
  ConfirmBulkActionDialog,
  type ConfirmActionKind,
} from "./ConfirmBulkActionDialog"
import { CreateUserDialog } from "./CreateUserDialog"
import { EditUserDialog } from "./EditUserDialog"
import { UserManagementHeader } from "./UserManagementHeader"
import { UserManagementSkeleton } from "./UserManagementSkeleton"
import { UsersTable } from "./UsersTable"

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof UsersIcon
}) {
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

export function UserManagementPage() {
  const [search, setSearch] = useState("")
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [budgetOpen, setBudgetOpen] = useState(false)
  const [budgetMode, setBudgetMode] = useState<"single" | "bulk">("bulk")
  const [budgetUsernames, setBudgetUsernames] = useState<string[]>([])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<ConfirmActionKind | null>(
    null
  )
  const [confirmUsernames, setConfirmUsernames] = useState<string[]>([])
  const usersQuery = useAdminUsers()
  const updatePremiumMutation = useUpdateAdminUsersPremium()
  const deleteUserMutation = useDeleteAdminUser()
  const deleteUsersBulkMutation = useDeleteAdminUsersBulk()
  const deleteBudgetMutation = useDeleteAdminUserMonthlyBudget()
  const deleteBudgetsBulkMutation = useDeleteAdminUsersMonthlyBudget()

  const users = useMemo(
    () => usersQuery.data?.users ?? [],
    [usersQuery.data?.users]
  )
  const normalUsers = users.filter((user) => user.role !== "admin")
  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    if (!normalizedSearch) {
      return users
    }

    return users.filter((user) =>
      [user.username, user.email, user.country]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedSearch))
    )
  }, [search, users])

  const selectedNormalUsernames = selectedUsernames.filter((username) =>
    normalUsers.some((user) => user.username === username)
  )
  const isConfirmPending =
    updatePremiumMutation.isPending ||
    deleteUserMutation.isPending ||
    deleteUsersBulkMutation.isPending ||
    deleteBudgetMutation.isPending ||
    deleteBudgetsBulkMutation.isPending

  const openBudgetDialog = (usernames: string[], mode: "single" | "bulk") => {
    setBudgetUsernames(usernames)
    setBudgetMode(mode)
    setBudgetOpen(true)
  }

  const openConfirm = (action: ConfirmActionKind, usernames: string[]) => {
    const allowedUsernames = usernames.filter((username) =>
      normalUsers.some((user) => user.username === username)
    )

    if (allowedUsernames.length === 0) {
      toast.error("Selecciona al menos un usuario normal")
      return
    }

    setConfirmAction(action)
    setConfirmUsernames(allowedUsernames)
    setConfirmOpen(true)
  }

  const handleConfirm = () => {
    if (!confirmAction || confirmUsernames.length === 0) {
      return
    }

    if (confirmAction === "premium-on" || confirmAction === "premium-off") {
      updatePremiumMutation.mutate(
        {
          usernames: confirmUsernames,
          isPremium: confirmAction === "premium-on",
        },
        {
          onSuccess: () => {
            toast.success("Privilegios premium actualizados")
            setConfirmOpen(false)
            setSelectedUsernames([])
          },
          onError: (error) =>
            toast.error(error.message || "No pudimos actualizar premium"),
        }
      )
      return
    }

    if (confirmAction === "delete-budget") {
      const mutation =
        confirmUsernames.length === 1
          ? deleteBudgetMutation
          : deleteBudgetsBulkMutation

      if (confirmUsernames.length === 1) {
        deleteBudgetMutation.mutate(confirmUsernames[0], {
          onSuccess: () => {
            toast.success("Presupuesto eliminado")
            setConfirmOpen(false)
          },
          onError: (error) =>
            toast.error(error.message || "No pudimos eliminar el presupuesto"),
        })
      } else {
        deleteBudgetsBulkMutation.mutate(
          { usernames: confirmUsernames },
          {
            onSuccess: () => {
              toast.success("Presupuestos eliminados")
              setConfirmOpen(false)
              setSelectedUsernames([])
            },
            onError: (error) =>
              toast.error(error.message || "No pudimos eliminar presupuestos"),
          }
        )
      }

      void mutation
      return
    }

    if (confirmUsernames.length === 1) {
      deleteUserMutation.mutate(confirmUsernames[0], {
        onSuccess: () => {
          toast.success("Usuario eliminado")
          setConfirmOpen(false)
          setSelectedUsernames((current) =>
            current.filter((username) => username !== confirmUsernames[0])
          )
        },
        onError: (error) =>
          toast.error(error.message || "No pudimos eliminar el usuario"),
      })
      return
    }

    deleteUsersBulkMutation.mutate(
      { usernames: confirmUsernames },
      {
        onSuccess: () => {
          toast.success("Usuarios eliminados")
          setConfirmOpen(false)
          setSelectedUsernames([])
        },
        onError: (error) =>
          toast.error(error.message || "No pudimos eliminar los usuarios"),
      }
    )
  }

  if (usersQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6 px-2 py-2 md:px-4 xl:px-8">
        <UserManagementHeader
          selectedCount={0}
          isFetching
          onCreateUser={() => setCreateOpen(true)}
          onRefresh={() => {
            void usersQuery.refetch()
          }}
          onBulkPremium={() => undefined}
          onBulkBudget={() => undefined}
          onBulkDeleteBudget={() => undefined}
          onBulkDelete={() => undefined}
        />
        <UserManagementSkeleton />
      </div>
    )
  }

  return (
    <div className="flex min-w-0 flex-col gap-6 px-2 py-2 md:px-4 xl:px-8">
      <UserManagementHeader
        selectedCount={selectedNormalUsernames.length}
        isFetching={usersQuery.isFetching}
        onCreateUser={() => setCreateOpen(true)}
        onRefresh={() => {
          void usersQuery.refetch()
        }}
        onBulkPremium={(isPremium) =>
          openConfirm(isPremium ? "premium-on" : "premium-off", selectedNormalUsernames)
        }
        onBulkBudget={() => openBudgetDialog(selectedNormalUsernames, "bulk")}
        onBulkDeleteBudget={() =>
          openConfirm("delete-budget", selectedNormalUsernames)
        }
        onBulkDelete={() => openConfirm("delete", selectedNormalUsernames)}
      />

      {usersQuery.error ? (
        <Alert variant="destructive">
          <AlertCircleIcon aria-hidden="true" />
          <AlertTitle>No pudimos cargar usuarios</AlertTitle>
          <AlertDescription>
            {usersQuery.error.message || "Intenta nuevamente en unos segundos."}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total" value={`${users.length}`} icon={UsersIcon} />
        <StatCard
          label="Usuarios"
          value={`${normalUsers.length}`}
          icon={UsersIcon}
        />
        <StatCard
          label="Premium"
          value={`${users.filter((user) => user.isPremium).length}`}
          icon={CrownIcon}
        />
        <StatCard
          label="Admins"
          value={`${users.filter((user) => user.role === "admin").length}`}
          icon={ShieldIcon}
        />
      </div>

      <Separator />

      <Card className="gap-0 py-0">
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-xl font-semibold">
                  Usuarios de la plataforma
                </h2>
                <Badge variant="outline">{filteredUsers.length} resultados</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Los administradores se muestran, pero no pueden seleccionarse
                para eliminaciones o acciones masivas.
              </p>
            </div>
            <div className="flex items-center gap-2 md:w-80">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por username, correo o país"
              />
            </div>
          </div>

          <UsersTable
            users={filteredUsers}
            selectedUsernames={selectedUsernames}
            onSelectionChange={setSelectedUsernames}
            onEditUser={(user) => setEditingUser(user)}
            onBudget={openBudgetDialog}
            onConfirmPremium={(usernames, isPremium) =>
              openConfirm(isPremium ? "premium-on" : "premium-off", usernames)
            }
            onConfirmDeleteBudget={(usernames) =>
              openConfirm("delete-budget", usernames)
            }
            onConfirmDelete={(usernames) => openConfirm("delete", usernames)}
          />
        </CardContent>
      </Card>

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditUserDialog
        user={editingUser}
        open={Boolean(editingUser)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingUser(null)
          }
        }}
      />
      <BudgetDialog
        open={budgetOpen}
        onOpenChange={setBudgetOpen}
        usernames={budgetUsernames}
        mode={budgetMode}
      />
      <ConfirmBulkActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        action={confirmAction}
        selectedCount={confirmUsernames.length}
        isPending={isConfirmPending}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
