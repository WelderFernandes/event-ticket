interface ExternalAuthRequest {
  username: string;
  password: string;
  grant_type: string;
  client_id: string;
  client_secret: string;
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
  private readonly baseURL = "https://sistemas.cariacica.es.gov.br/authserver";
  private readonly clientId = process.env.EXTERNAL_AUTH_CLIENT_ID || "";
  private readonly clientSecret = process.env.EXTERNAL_AUTH_CLIENT_SECRET || "";

  async authenticate(
    email: string,
    password: string
  ): Promise<ExternalAuthResponse> {
    const tokenEndpoint = `${this.baseURL}/OAuth20/Token`;

    const requestBody: ExternalAuthRequest = {
      username: email,
      password: password,
      grant_type: "password",
      client_id: this.clientId,
      client_secret: this.clientSecret,
    };

    try {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization:
            "Basic U21hckFQREZhbGFDaWRhZGFvOlNtYXJBUERGYWxhQ2lkYWRhbw==",
        },
        body: new URLSearchParams(requestBody as any),
      });
      console.log(
        "🚀 ~ external-auth.service.ts:56 ~ authenticate ~ response:",
        response
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.log(
          "🚀 ~ external-auth.service.ts:63 ~ authenticate ~ errorData:",
          errorData
        );
        throw new Error(
          `Falha na autenticação: ${response.status} - ${errorData}`,
          {
            cause: response,
          }
        );
      }

      const data: ExternalAuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Erro na autenticação externa:", error);
      throw new Error("Erro ao conectar com o servidor de autenticação");
    }
  }

  async getUserInfo(accessToken: string): Promise<ExternalUserInfo> {
    // Endpoint para obter informações do usuário (você pode precisar ajustar)
    const userInfoEndpoint = `${this.baseURL}/OAuth20/UserInfo`;

    try {
      const response = await fetch(userInfoEndpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Falha ao obter informações do usuário: ${response.status}`
        );
      }

      const userInfo: ExternalUserInfo = await response.json();
      return userInfo;
    } catch (error) {
      console.error("Erro ao obter informações do usuário:", error);
      throw new Error("Erro ao obter informações do usuário");
    }
  }

  async refreshToken(refreshToken: string): Promise<ExternalAuthResponse> {
    const tokenEndpoint = `${this.baseURL}/OAuth20/Token`;

    const requestBody = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    };

    try {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams(requestBody as any),
      });

      if (!response.ok) {
        throw new Error(`Falha ao renovar token: ${response.status}`);
      }

      const data: ExternalAuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      throw new Error("Erro ao renovar token de acesso");
    }
  }
}

export const externalAuthService = new ExternalAuthService();
