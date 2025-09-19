import { externalAuthService, ExternalUserInfo } from "./external-auth.service";
import { User, UserRole } from "../domain/entities/user.entity";

interface HybridAuthResult {
  success: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  error?: string;
}

export class HybridAuthService {
  async authenticateWithExternal(
    email: string,
    password: string
  ): Promise<HybridAuthResult> {
    try {
      // 1. Autenticar com a API externa
      const authResponse = await externalAuthService.authenticate(
        email,
        password
      );

      // 2. Obter informações do usuário
      const userInfo = await externalAuthService.getUserInfo(
        authResponse.access_token
      );

      // 3. Mapear para o formato interno
      const user: User = {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        emailVerified: true, // Assumindo que usuários da API externa são verificados
        image: undefined,
        role: this.mapExternalRoleToInternal(userInfo.role),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        success: true,
        user,
        accessToken: authResponse.access_token,
        refreshToken: authResponse.refresh_token,
        expiresIn: authResponse.expires_in,
      };
    } catch (error) {
      console.error("Erro na autenticação híbrida:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido na autenticação",
      };
    }
  }

  private mapExternalRoleToInternal(externalRole?: string): UserRole {
    // Mapear roles da API externa para roles internas
    switch (externalRole?.toUpperCase()) {
      case "ADMIN":
      case "ADMINISTRADOR":
        return UserRole.ADMIN;
      case "SORTEADOR":
      case "ORGANIZADOR":
        return UserRole.SORTEADOR;
      case "USER":
      case "USUARIO":
      case "FUNCIONARIO":
      default:
        return UserRole.USER;
    }
  }

  async refreshExternalToken(refreshToken: string): Promise<HybridAuthResult> {
    try {
      const authResponse = await externalAuthService.refreshToken(refreshToken);

      return {
        success: true,
        accessToken: authResponse.access_token,
        refreshToken: authResponse.refresh_token,
        expiresIn: authResponse.expires_in,
      };
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao renovar token",
      };
    }
  }

  async validateExternalToken(accessToken: string): Promise<boolean> {
    try {
      await externalAuthService.getUserInfo(accessToken);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const hybridAuthService = new HybridAuthService();
