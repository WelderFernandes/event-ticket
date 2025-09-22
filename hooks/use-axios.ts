"use client";

import { useCallback } from "react";
import { authAxios, apiAxios, authenticatedRequest } from "@/lib/axios-config";

export function useAxios() {
  const makeAuthRequest = useCallback(
    async <T>(config: Parameters<typeof authAxios.request>[0]): Promise<T> => {
      const response = await authAxios.request<T>(config);
      return response.data;
    },
    []
  );

  const makeApiRequest = useCallback(
    async <T>(config: Parameters<typeof apiAxios.request>[0]): Promise<T> => {
      const response = await apiAxios.request<T>(config);
      return response.data;
    },
    []
  );

  const makeAuthenticatedRequest = useCallback(
    async <T>(
      config: Parameters<typeof authenticatedRequest>[0],
      accessToken?: string
    ): Promise<T> => {
      return authenticatedRequest<T>(config, accessToken);
    },
    []
  );

  return {
    authAxios,
    apiAxios,
    makeAuthRequest,
    makeApiRequest,
    makeAuthenticatedRequest,
  };
}
