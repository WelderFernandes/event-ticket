import Cookies from "js-cookie";

// Configurações dos cookies
const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production", // HTTPS em produção
  sameSite: "lax" as const,
  expires: 7, // 7 dias
};

// Nomes dos cookies
export const AUTH_COOKIES = {
  ACCESS_TOKEN: "hybrid_auth_access_token",
  REFRESH_TOKEN: "hybrid_auth_refresh_token",
  EXPIRES_AT: "hybrid_auth_expires_at",
  USER: "hybrid_auth_user",
} as const;

/**
 * Salva o token de acesso nos cookies
 */
export function setAccessTokenCookie(token: string): void {
  Cookies.set(AUTH_COOKIES.ACCESS_TOKEN, token, COOKIE_OPTIONS);
}

/**
 * Obtém o token de acesso dos cookies
 */
export function getAccessTokenCookie(): string | undefined {
  return Cookies.get(AUTH_COOKIES.ACCESS_TOKEN);
}

/**
 * Salva o refresh token nos cookies
 */
export function setRefreshTokenCookie(token: string): void {
  Cookies.set(AUTH_COOKIES.REFRESH_TOKEN, token, COOKIE_OPTIONS);
}

/**
 * Obtém o refresh token dos cookies
 */
export function getRefreshTokenCookie(): string | undefined {
  return Cookies.get(AUTH_COOKIES.REFRESH_TOKEN);
}

/**
 * Salva a data de expiração nos cookies
 */
export function setExpiresAtCookie(expiresAt: string): void {
  Cookies.set(AUTH_COOKIES.EXPIRES_AT, expiresAt, COOKIE_OPTIONS);
}

/**
 * Obtém a data de expiração dos cookies
 */
export function getExpiresAtCookie(): string | undefined {
  return Cookies.get(AUTH_COOKIES.EXPIRES_AT);
}

/**
 * Salva as informações do usuário nos cookies
 */
export function setUserCookie(user: any): void {
  const userString = JSON.stringify(user);
  Cookies.set(AUTH_COOKIES.USER, userString, COOKIE_OPTIONS);
}

/**
 * Obtém as informações do usuário dos cookies
 */
export function getUserCookie(): any | null {
  const userString = Cookies.get(AUTH_COOKIES.USER);
  if (!userString) return null;

  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error("Erro ao fazer parse do usuário dos cookies:", error);
    return null;
  }
}

/**
 * Remove todos os cookies de autenticação
 */
export function clearAuthCookies(): void {
  Object.values(AUTH_COOKIES).forEach((cookieName) => {
    Cookies.remove(cookieName);
  });
}

/**
 * Verifica se há uma sessão válida nos cookies
 */
export function hasValidSessionInCookies(): boolean {
  const accessToken = getAccessTokenCookie();
  const expiresAt = getExpiresAtCookie();

  if (!accessToken || !expiresAt) return false;

  try {
    const expiresDate = new Date(expiresAt);
    const now = new Date();
    return expiresDate > now;
  } catch (error) {
    console.error("Erro ao verificar expiração da sessão:", error);
    return false;
  }
}

/**
 * Sincroniza dados entre localStorage e cookies
 */
export function syncAuthDataBetweenStorage(): {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  user?: any;
} {
  // Prioriza cookies, mas fallback para localStorage
  const accessToken =
    getAccessTokenCookie() ||
    localStorage.getItem("hybrid_auth_access_token") ||
    undefined;
  const refreshToken =
    getRefreshTokenCookie() ||
    localStorage.getItem("hybrid_auth_refresh_token") ||
    undefined;
  const expiresAt =
    getExpiresAtCookie() ||
    localStorage.getItem("hybrid_auth_expires_at") ||
    undefined;

  let user = getUserCookie();
  if (!user) {
    const userString = localStorage.getItem("hybrid_auth_user");
    if (userString) {
      try {
        user = JSON.parse(userString);
      } catch (error) {
        console.error("Erro ao fazer parse do usuário do localStorage:", error);
      }
    }
  }

  return {
    accessToken,
    refreshToken,
    expiresAt,
    user,
  };
}

/**
 * Salva dados de autenticação em ambos os lugares (cookies e localStorage)
 */
export function saveAuthDataToBothStorages(data: {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  user?: any;
}): void {
  const { accessToken, refreshToken, expiresAt, user } = data;

  // Salva nos cookies
  if (accessToken) {
    setAccessTokenCookie(accessToken);
    localStorage.setItem("hybrid_auth_access_token", accessToken);
  }

  if (refreshToken) {
    setRefreshTokenCookie(refreshToken);
    localStorage.setItem("hybrid_auth_refresh_token", refreshToken);
  }

  if (expiresAt) {
    setExpiresAtCookie(expiresAt);
    localStorage.setItem("hybrid_auth_expires_at", expiresAt);
  }

  if (user) {
    setUserCookie(user);
    localStorage.setItem("hybrid_auth_user", JSON.stringify(user));
  }
}

/**
 * Limpa dados de autenticação de ambos os lugares
 */
export function clearAuthDataFromBothStorages(): void {
  // Limpa cookies
  clearAuthCookies();

  // Limpa localStorage
  localStorage.removeItem("hybrid_auth_access_token");
  localStorage.removeItem("hybrid_auth_refresh_token");
  localStorage.removeItem("hybrid_auth_expires_at");
  localStorage.removeItem("hybrid_auth_user");
}
