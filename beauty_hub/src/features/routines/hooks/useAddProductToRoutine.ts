"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { addProductToRoutine } from "../routines-api"
import type { AddProductToRoutineInput } from "../types"

export function useAddProductToRoutine(username: string, routineId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AddProductToRoutineInput) =>
      addProductToRoutine(username, routineId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["routines", "user", username],
      })
    },
  })
}
