"use client";

import React, { useState } from "react";
import { RegisterForm } from "../components/register-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/dashboard");
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

      <RegisterForm onSuccess={handleSuccess} onError={handleError} />

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Já tem uma conta?</p>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Fazer login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
