"use client"

import {
  BadgeDollarSignIcon,
  CrownIcon,
  EditIcon,
  MoreHorizontalIcon,
  ShieldMinusIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

import type { AdminUser } from "../types"
import { formatCurrency, toTextList } from "../utils/user-formatters"

interface UsersTableProps {
  users: AdminUser[]
  selectedUsernames: string[]
  onSelectionChange: (usernames: string[]) => void
  onEditUser: (user: AdminUser) => void
  onBudget: (usernames: string[], mode: "single" | "bulk") => void
  onConfirmPremium: (usernames: string[], isPremium: boolean) => void
  onConfirmDeleteBudget: (usernames: string[]) => void
  onConfirmDelete: (usernames: string[]) => void
}

export function UsersTable({
  users,
  selectedUsernames,
  onSelectionChange,
  onEditUser,
  onBudget,
  onConfirmPremium,
  onConfirmDeleteBudget,
  onConfirmDelete,
}: UsersTableProps) {
  const selectableUsers = users.filter((user) => user.role !== "admin")
  const selectedSet = new Set(selectedUsernames)
  const allSelectableSelected =
    selectableUsers.length > 0 &&
    selectableUsers.every((user) => selectedSet.has(user.username))

  const toggleUser = (username: string) => {
    if (selectedSet.has(username)) {
      onSelectionChange(selectedUsernames.filter((item) => item !== username))
      return
    }

    onSelectionChange([...selectedUsernames, username])
  }

  const toggleAllSelectable = () => {
    if (allSelectableSelected) {
      onSelectionChange([])
      return
    }

    onSelectionChange(selectableUsers.map((user) => user.username))
  }

  return (
    <div className="max-w-full overflow-hidden rounded-xl border border-border bg-card">
      <Table className="min-w-[1120px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelectableSelected}
                aria-label="Seleccionar usuarios normales"
                onCheckedChange={toggleAllSelectable}
              />
            </TableHead>
            <TableHead className="w-[190px]">Usuario</TableHead>
            <TableHead className="w-[260px]">Correo</TableHead>
            <TableHead className="w-[130px]">Rol</TableHead>
            <TableHead className="w-[130px]">Premium</TableHead>
            <TableHead className="w-[110px]">Edad</TableHead>
            <TableHead className="w-[150px]">País</TableHead>
            <TableHead className="w-[170px]">Presupuesto</TableHead>
            <TableHead className="w-[260px]">Preferencias</TableHead>
            <TableHead className="w-12 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-28 text-center">
                No hay usuarios registrados.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const isAdmin = user.role === "admin"
              const isSelected = selectedSet.has(user.username)
              const preferences = toTextList(user.preferences)

              return (
                <TableRow
                  key={user.username}
                  data-state={isSelected ? "selected" : undefined}
                  className={cn(isAdmin && "bg-muted/30")}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      disabled={isAdmin}
                      aria-label={`Seleccionar ${user.username}`}
                      onCheckedChange={() => toggleUser(user.username)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[170px] truncate font-medium">
                      {user.username}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[240px] truncate text-muted-foreground">
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={isAdmin ? "secondary" : "outline"}>
                      {isAdmin ? "Admin" : "Usuario"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isPremium ? "secondary" : "outline"}>
                      {user.isPremium ? "Premium" : "General"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.age ?? "No definida"}</TableCell>
                  <TableCell>
                    <div className="max-w-[130px] truncate">
                      {user.country ?? "No definido"}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(user.monthlyBudget)}</TableCell>
                  <TableCell>
                    <div className="max-w-[240px] truncate text-muted-foreground">
                      {preferences.length ? preferences.join(", ") : "Sin preferencias"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon aria-hidden="true" />
                          <span className="sr-only">Abrir acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => onEditUser(user)}>
                          <EditIcon aria-hidden="true" />
                          Editar usuario
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => onBudget([user.username], "single")}
                        >
                          <BadgeDollarSignIcon aria-hidden="true" />
                          Cambiar presupuesto
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            onConfirmDeleteBudget([user.username])
                          }
                        >
                          Borrar presupuesto
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={() =>
                            onConfirmPremium([user.username], !user.isPremium)
                          }
                        >
                          {user.isPremium ? (
                            <ShieldMinusIcon aria-hidden="true" />
                          ) : (
                            <CrownIcon aria-hidden="true" />
                          )}
                          {user.isPremium ? "Quitar premium" : "Hacer premium"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          disabled={isAdmin}
                          onSelect={() => onConfirmDelete([user.username])}
                        >
                          <Trash2Icon aria-hidden="true" />
                          Eliminar usuario
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
