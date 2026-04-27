"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createRoutine } from "../routines-api"
import type { CreateRoutineInput } from "../types"

export function useCreateRoutine(username: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateRoutineInput) => createRoutine(username, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["routines", "user", username],
      })
    },
  })
}
