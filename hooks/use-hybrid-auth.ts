"use client";

import { useState, useEffect } from "react";
import { hybridAuthService } from "@/lib/services/hybrid-auth.service";
import { User, UserRole } from "@/lib/domain/entities/user.entity";
import {
  syncAuthDataBetweenStorage,
  saveAuthDataToBothStorages,
  clearAuthDataFromBothStorages,
  hasValidSessionInCookies,
} from "@/lib/utils/auth-cookies";
import { useRouter } from "next/navigation";

interface HybridAuthState {
  user: Partial<User> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export function useHybridAuth() {
  const [authState, setAuthState] = useState<HybridAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    accessToken: null,
    refreshToken: null,
  });

  const router = useRouter();

  // Verificar se há sessão salva nos cookies/localStorage
  useEffect(() => {
    const checkStoredSession = () => {
      try {
        // Sincroniza dados entre cookies e localStorage
        const {
          accessToken,
          refreshToken: storedRefreshToken,
          expiresAt,
          user,
        } = syncAuthDataBetweenStorage();

        if (user && accessToken && expiresAt) {
          const expiresDate = new Date(expiresAt);
          const now = new Date();

          if (expiresDate > now) {
            // Token ainda válido
            setAuthState({
              user: user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              accessToken: accessToken,
              refreshToken: storedRefreshToken || null,
            });
          } else if (storedRefreshToken) {
            // Token expirado, tentar renovar
            refreshTokenFunction(storedRefreshToken);
          } else {
            // Sem refresh token, limpar sessão
            clearSession();
          }
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Erro ao verificar sessão armazenada:", error);
        clearSession();
      }
    };

    checkStoredSession();
  }, []);

  const login = async (
    cpf: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await hybridAuthService.authenticateWithExternal(
        cpf,
        password
      );

      if (result.success && result.user && result.accessToken) {
        const expiresAt = new Date(
          Date.now() + (result.expiresIn || 3600) * 1000
        );

        // Salvar em ambos os lugares (cookies e localStorage)
        saveAuthDataToBothStorages({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresAt: expiresAt.toISOString(),
          user: result.user,
        });

        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken || null,
        });

        return { success: true };
      } else {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: result.error || "Erro na autenticação",
        }));
        return {
          success: false,
          error: result.error || "Erro na autenticação",
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    clearSession();
    router.push("/auth/login");
  };

  const refreshTokenFunction = async (refreshToken: string) => {
    try {
      const result = await hybridAuthService.refreshExternalToken(refreshToken);

      if (result.success && result.accessToken) {
        const expiresAt = new Date(
          Date.now() + (result.expiresIn || 3600) * 1000
        );

        // Atualizar tokens em ambos os lugares
        saveAuthDataToBothStorages({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresAt: expiresAt.toISOString(),
        });

        setAuthState((prev) => ({
          ...prev,
          accessToken: result.accessToken!,
          refreshToken: result.refreshToken || prev.refreshToken,
          error: null,
        }));
      } else {
        // Falha ao renovar, fazer logout
        clearSession();
      }
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      clearSession();
    }
  };

  const clearSession = () => {
    // Limpar de ambos os lugares (cookies e localStorage)
    clearAuthDataFromBothStorages();

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,
    });
    router.refresh();
  };

  const hasRole = (role: UserRole): boolean => {
    return authState.user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return authState.user?.role ? roles.includes(authState.user.role) : false;
  };

  return {
    ...authState,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAdmin: hasRole(UserRole.ADMIN),
    isSorteador: hasRole(UserRole.SORTEADOR),
    isUser: hasRole(UserRole.USER),
  };
}
