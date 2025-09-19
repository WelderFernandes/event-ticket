"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { createAbilityFor, AppAbility } from "./abilities";
import { User } from "../../domain/entities/user.entity";

// Criar o contexto localmente
const AbilityContext = createContext<AppAbility | null>(null);

interface AuthorizationProviderProps {
  user: User | null;
  children: ReactNode;
}

export function AuthorizationProvider({
  user,
  children,
}: AuthorizationProviderProps) {
  const ability = createAbilityFor(user);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

export function useAuthorization() {
  const ability = useContext(AbilityContext);
  if (!ability) {
    throw new Error(
      "useAuthorization must be used within an AuthorizationProvider"
    );
  }
  return ability;
}
