interface ExternalAuthError {
  error: string;
  error_description: string;
  detail?: any;
}

/**
 * Traduz erros de autenticação externa para mensagens amigáveis em português
 */
export function translateAuthError(error: any): string {
  // Se já é uma string, retorna como está
  if (typeof error === "string") {
    return error;
  }

  // Se é um objeto de erro da API externa
  if (error?.error_description || error?.error) {
    const authError = error as ExternalAuthError;

    switch (authError.error) {
      case "invalid_grant":
        return "CPF ou senha incorretos. Verifique suas credenciais e tente novamente.";

      case "invalid_client":
        return "Erro de configuração do sistema. Entre em contato com o suporte técnico.";

      case "invalid_request":
        return "Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.";

      case "unauthorized_client":
        return "Acesso não autorizado. Entre em contato com o administrador do sistema.";

      case "unsupported_grant_type":
        return "Tipo de autenticação não suportado.";

      case "invalid_scope":
        return "Permissões insuficientes para acessar o sistema.";

      case "server_error":
        return "Erro interno do servidor. Tente novamente em alguns minutos.";

      default:
        return (
          authError.error_description ||
          "Erro de autenticação. Tente novamente."
        );
    }
  }

  // Se é um erro de rede ou conexão
  if (error?.message) {
    if (error.message.includes("fetch")) {
      return "Erro de conexão. Verifique sua internet e tente novamente.";
    }

    if (error.message.includes("timeout")) {
      return "Tempo limite excedido. Tente novamente.";
    }

    if (error.message.includes("network")) {
      return "Erro de rede. Verifique sua conexão.";
    }
  }

  console.error("AQUI", error);

  // Erro genérico
  return error;
}

/**
 * Formata CPF para exibição (xxx.xxx.xxx-xx)
 */
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, "");
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Remove formatação do CPF, mantendo apenas números
 */
export function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, "");
}
