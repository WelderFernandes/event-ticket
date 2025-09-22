"use client";

import { useState } from "react";
import { LoginForm } from "../components/login-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  console.log("🚀 ~ page.tsx:10 ~ LoginPage ~ error:", error);
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/painel");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="space-y-6 ">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-pmc-gray mb-2">
          Cariacica Eventos
        </h1>
        <p className="text-pmc-gray">Sistema de gerenciamento de eventos</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error.split(":")[1].trim().toString()}
          </AlertDescription>
        </Alert>
      )}

      <LoginForm onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}
