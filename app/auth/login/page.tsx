"use client";

import { useState } from "react";
import { LoginForm } from "../components/login-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/painel");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Ticket</h1>
        <p className="text-gray-600">Sistema de gerenciamento de eventos</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <LoginForm onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}
