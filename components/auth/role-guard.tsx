"use client";

import React, { ReactNode } from "react";
import { useAuthorization } from "@/lib/application/authorization/authorization-context";
import { Actions, Subjects } from "@/lib/application/authorization/abilities";
import { UserRole } from "@/lib/domain/entities/user.entity";
import { useHybridAuth } from "@/hooks/use-hybrid-auth";

interface RoleGuardProps {
  children: ReactNode;
  action: Actions;
  subject: Subjects;
  fallback?: ReactNode;
  requiredRoles?: UserRole[];
}

export function RoleGuard({
  children,
  action,
  subject,
  fallback = null,
  requiredRoles,
}: RoleGuardProps) {
  const ability = useAuthorization();

  // Verificar permissão usando CASL
  const canPerformAction = ability.can(action, subject);

  if (!canPerformAction) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RoleBasedRenderProps {
  children: ReactNode;
  roles: UserRole[];
  fallback?: ReactNode;
}

export function RoleBasedRender({
  children,
  roles,
  fallback = null,
}: RoleBasedRenderProps) {
  const { hasAnyRole } = useHybridAuth();

  if (!hasAnyRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
