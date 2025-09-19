"use client";

import React, { ReactNode } from "react";
import { useHybridAuth } from "@/hooks/use-hybrid-auth";
import { AuthorizationProvider } from "@/lib/application/authorization/authorization-context";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user } = useHybridAuth();

  return <AuthorizationProvider user={user}>{children}</AuthorizationProvider>;
}
