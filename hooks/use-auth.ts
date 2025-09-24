"use client";

import { useSession } from "@/lib/auth-client";
import { User, UserRole } from "@/lib/domain/entities/user.entity";

export function useAuth() {
  const { data: session, isPending, error } = useSession();

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        nome: session.user.name,
        email: session.user.email,
        cpf: (session.user as any).cpf || "",
        matricula: (session.user as any).matricula || 0,
        emailVerified: session.user.emailVerified || false,
        image: session.user.image || undefined,
        role: ((session.user as any).role as UserRole) || UserRole.USER,
        status: (session.user as any).status || "ACTIVE",
        createdAt: new Date(session.user.createdAt || new Date()),
        updatedAt: new Date(session.user.updatedAt || new Date()),
      }
    : null;

  const isAuthenticated = !!user;
  const isLoading = isPending;

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const isAdmin = hasRole(UserRole.ADMIN);
  const isSorteador = hasRole(UserRole.SORTEADOR);
  const isUser = hasRole(UserRole.USER);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    hasRole,
    hasAnyRole,
    isAdmin,
    isSorteador,
    isUser,
  };
}
