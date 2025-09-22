import { authAxios, authRequest } from "../axios-config";

interface ExternalAuthRequest {
  username: string;
  password: string;
  grant_type: string;
}

interface ExternalAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

interface ExternalUserInfo {
  id: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
  position?: string;
}

export class ExternalAuthService {
  private readonly clientId = process.env.EXTERNAL_AUTH_CLIENT_ID || "";
  private readonly clientSecret = process.env.EXTERNAL_AUTH_CLIENT_SECRET || "";

  async authenticate(
    cpf: string,
    password: string
  ): Promise<ExternalAuthResponse> {
    try {
      const requestBody: ExternalAuthRequest = {
        username: cpf.replace(/[.\-]/g, ""),
        password: password,
        grant_type: "password",
      };

      const data = await authRequest<ExternalAuthResponse>(
        "authserver/OAuth20/Token",
        requestBody,
        {
          Authorization: process.env.SMAR_AUTH_SECRET
            ? `Basic ${process.env.SMAR_AUTH_SECRET}`
            : "Basic U21hckFQREZhbGFDaWRhZGFvOlNtYXJBUERGYWxhQ2lkYWRhbw==",
        }
      );

      return data;
    } catch (error) {
      console.error("Erro na autenticação externa:", error);

      // Preserva o erro original para melhor tratamento
      const authError = new Error(error as string);
      (authError as any).originalError = error;
      throw authError;
    }
  }

  async getUserInfo(
    accessToken: string,
    userName?: string
  ): Promise<ExternalUserInfo> {
    try {
      // Primeiro, tenta extrair o userName do token se não foi fornecido

      // Se temos o userName, tenta o endpoint principal
      console.log(`Buscando dados do usuário: ${userName} , ${accessToken}`);

      const response = await authAxios.get(
        `/rhserver/RegistroPessoal/GetDadosPortal/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(
        "🚀 ~ external-auth.service.ts:81 ~ getUserInfo ~ response:",
        response
      );

      // Fallback final
      return {
        id: "user_" + Date.now(),
        name: response.data.Nome,
        email: response.data.Email,
        role: "USER",
        department: "Não informado",
        position: "Não informado",
      };
    } catch (error) {
      console.error("Erro geral ao obter informações do usuário:", error);

      // Retorna dados mínimos para não quebrar o fluxo
      return {
        id: "user_" + Date.now(),
        name: "Usuário",
        email: "user@cariacica.es.gov.br",
        role: "USER",
        department: "Não informado",
        position: "Não informado",
      };
    }
  }

  /**
   * Mapeia cargos/funções para roles do sistema
   */
  private mapUserRole(cargo?: string): string {
    if (!cargo) return "USER";

    const cargoLower = cargo.toLowerCase();

    // Administradores
    if (
      cargoLower.includes("administrador") ||
      cargoLower.includes("admin") ||
      cargoLower.includes("diretor")
    ) {
      return "ADMIN";
    }

    // Organizadores/Sorteadores
    if (
      cargoLower.includes("organizador") ||
      cargoLower.includes("sorteador") ||
      cargoLower.includes("coordenador") ||
      cargoLower.includes("supervisor")
    ) {
      return "SORTEADOR";
    }

    // Usuários comuns
    return "USER";
  }

  async refreshToken(refreshToken: string): Promise<ExternalAuthResponse> {
    try {
      const requestBody = {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      };

      const data = await authRequest<ExternalAuthResponse>(
        "/OAuth20/Token",
        requestBody
      );

      return data;
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      throw new Error("Erro ao renovar token de acesso");
    }
  }
}

export const externalAuthService = new ExternalAuthService();
