"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { loginUser } from "@/features/auth/auth-api";

import type { LoginInput } from "@/features/auth/types";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: LoginInput) => loginUser(input),
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message || "Login exitoso");
      router.push("/generalRecommendations");
    },
    onError: (error) => {
      toast.error(error.message || "Error al iniciar sesion");
    },
  });
}
