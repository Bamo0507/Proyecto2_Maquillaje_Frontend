"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/features/auth/hooks/useLogin";

import type { LoginInput } from "@/features/auth/types";

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contrasena es requerida"),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginInput) => {
    loginMutation.mutate(values);
  };

  return (
    <Card className="w-full border-border/80 bg-card/80 shadow-sm backdrop-blur">
      <CardHeader>
        <CardTitle>Iniciar sesion</CardTitle>
        <CardDescription>
          Ingresa tu usuario y contrasena para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={Boolean(errors.username)}>
              <FieldLabel htmlFor="username">Usuario</FieldLabel>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                aria-invalid={Boolean(errors.username)}
                disabled={loginMutation.isPending}
                {...register("username")}
              />
              <FieldError errors={[errors.username]} />
            </Field>

            <Field data-invalid={Boolean(errors.password)}>
              <FieldLabel htmlFor="password">Contrasena</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  className="pr-10"
                  disabled={loginMutation.isPending}
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-1/2 right-1 -translate-y-1/2"
                  aria-label={
                    showPassword ? "Ocultar contrasena" : "Mostrar contrasena"
                  }
                  disabled={loginMutation.isPending}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <EyeOffIcon aria-hidden="true" />
                  ) : (
                    <EyeIcon aria-hidden="true" />
                  )}
                </Button>
              </div>
              <FieldError errors={[errors.password]} />
            </Field>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <LoaderCircleIcon
                  data-icon="inline-start"
                  aria-hidden="true"
                  className="animate-spin"
                />
              ) : null}
              Entrar
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
