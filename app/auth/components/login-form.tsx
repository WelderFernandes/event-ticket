"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CPFInput } from "@/components/ui/cpf-input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoginFormData, loginSchema } from "../schemas/auth.schema";
import { useHybridAuth } from "@/hooks/use-hybrid-auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useHybridAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cpf: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    try {
      const result = await login(values.cpf, values.password);

      if (result.success) {
        onSuccess?.();
      } else {
        onError?.(result.error || "Credenciais inválidas");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao fazer login";
      onError?.(errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
        <CardDescription className="text-center">
          Digite suas credenciais para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <CPFInput
                  id="cpf"
                  placeholder="000.000.000-00"
                  className={errors.cpf ? "border-red-500" : ""}
                  {...field}
                />
              )}
            />
            {errors.cpf && (
              <Alert variant="destructive">
                <AlertDescription>{errors.cpf.message}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <Alert variant="destructive">
                <AlertDescription>{errors.password.message}</AlertDescription>
              </Alert>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
