"use client";

import { useState, useEffect } from "react";
import { hybridAuthService } from "@/lib/services/hybrid-auth.service";
import { User, UserRole } from "@/lib/domain/entities/user.entity";

interface HybridAuthState {
  user: User | null;
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

  // Verificar se há sessão salva no localStorage
  useEffect(() => {
    const checkStoredSession = () => {
      try {
        const storedUser = localStorage.getItem("hybrid_auth_user");
        const storedAccessToken = localStorage.getItem(
          "hybrid_auth_access_token"
        );
        const storedRefreshToken = localStorage.getItem(
          "hybrid_auth_refresh_token"
        );
        const storedExpiresAt = localStorage.getItem("hybrid_auth_expires_at");

        if (storedUser && storedAccessToken && storedExpiresAt) {
          const expiresAt = new Date(storedExpiresAt);
          const now = new Date();

          if (expiresAt > now) {
            // Token ainda válido
            setAuthState({
              user: JSON.parse(storedUser),
              isAuthenticated: true,
              isLoading: false,
              error: null,
              accessToken: storedAccessToken,
              refreshToken: storedRefreshToken,
            });
          } else if (storedRefreshToken) {
            // Token expirado, tentar renovar
            refreshToken(storedRefreshToken);
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
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await hybridAuthService.authenticateWithExternal(
        email,
        password
      );

      if (result.success && result.user && result.accessToken) {
        const expiresAt = new Date(
          Date.now() + (result.expiresIn || 3600) * 1000
        );

        // Salvar no localStorage
        localStorage.setItem("hybrid_auth_user", JSON.stringify(result.user));
        localStorage.setItem("hybrid_auth_access_token", result.accessToken);
        if (result.refreshToken) {
          localStorage.setItem(
            "hybrid_auth_refresh_token",
            result.refreshToken
          );
        }
        localStorage.setItem("hybrid_auth_expires_at", expiresAt.toISOString());

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
  };

  const refreshToken = async (refreshToken: string) => {
    try {
      const result = await hybridAuthService.refreshExternalToken(refreshToken);

      if (result.success && result.accessToken) {
        const expiresAt = new Date(
          Date.now() + (result.expiresIn || 3600) * 1000
        );

        // Atualizar tokens no localStorage
        localStorage.setItem("hybrid_auth_access_token", result.accessToken);
        if (result.refreshToken) {
          localStorage.setItem(
            "hybrid_auth_refresh_token",
            result.refreshToken
          );
        }
        localStorage.setItem("hybrid_auth_expires_at", expiresAt.toISOString());

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
    localStorage.removeItem("hybrid_auth_user");
    localStorage.removeItem("hybrid_auth_access_token");
    localStorage.removeItem("hybrid_auth_refresh_token");
    localStorage.removeItem("hybrid_auth_expires_at");

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,
    });
  };

  const hasRole = (role: UserRole): boolean => {
    return authState.user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return authState.user ? roles.includes(authState.user.role) : false;
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
