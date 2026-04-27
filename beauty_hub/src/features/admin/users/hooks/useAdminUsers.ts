"use client"

import { useQuery } from "@tanstack/react-query"

import { getAdminUsers } from "../admin-users-api"

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAdminUsers,
    staleTime: 2 * 60 * 1000,
  })
}
