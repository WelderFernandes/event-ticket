import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Configuração base do axios
const createAxiosInstance = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Interceptor de request
  instance.interceptors.request.use(
    (config) => {
      // Log da requisição em desenvolvimento
      if (process.env.NODE_ENV === "development") {
        console.log("🚀 Request:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          data: config.data,
          headers: config.headers,
        });
      }

      return config;
    },
    (error) => {
      console.error("❌ Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Interceptor de response
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log da resposta em desenvolvimento
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Response:", {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers,
        });
      }

      return response;
    },
    (error: AxiosError) => {
      // Log do erro em desenvolvimento (exceto para 404s que são esperados)
      if (
        process.env.NODE_ENV === "development" &&
        error.response?.status !== 404
      ) {
        console.error("❌ Response Error:", error);
      } else if (
        error.response?.status === 404 &&
        process.env.NODE_ENV === "development"
      ) {
        // Log mais suave para 404s
        console.log("ℹ️ Endpoint não encontrado (404):", {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
        });
      }

      // Tratamento específico de erros
      console.log(
        "🚀 ~ axios-config.ts:74 ~ createAxiosInstance ~ error:",
        error
      );
      if (error.response) {
        // Erro com resposta do servidor
        const status = error.response.status;
        const data = error.response.data as any;

        // Preserva o erro original para melhor tratamento
        const enhancedError = new Error();
        (enhancedError as any).originalError = data;
        (enhancedError as any).status = status;
        (enhancedError as any).response = error.response;

        switch (status) {
          case 400:
            enhancedError.message =
              data?.error_description || data?.message || "Dados inválidos";
            break;
          case 401:
            enhancedError.message = data?.error_description || "Não autorizado";
            break;
          case 403:
            enhancedError.message = data?.error_description || "Acesso negado";
            break;
          case 404:
            enhancedError.message = "Recurso não encontrado";
            break;
          case 422:
            enhancedError.message =
              data?.error_description || "Dados inválidos";
            break;
          case 500:
            enhancedError.message = "Erro interno do servidor";
            break;
          case 502:
            enhancedError.message = "Servidor indisponível";
            break;
          case 503:
            enhancedError.message = "Serviço temporariamente indisponível";
            break;
          default:
            enhancedError.message =
              data?.error_description || data?.message || `Erro ${status}`;
        }

        console.log(
          "🚀 ~ axios-config.ts:122 ~ createAxiosInstance ~ enhancedError:",
          enhancedError,
          data
        );
        throw enhancedError;
      } else if (error.request) {
        // Erro de rede/conexão
        const networkError = new Error(
          "Erro de conexão. Verifique sua internet e tente novamente."
        );
        (networkError as any).originalError = error.request;
        throw networkError;
      } else {
        // Outros erros
        const genericError = new Error(error.message || "Erro inesperado");
        (genericError as any).originalError = error;
        throw genericError;
      }
    }
  );

  return instance;
};

// Instância principal para autenticação
export const authAxios = createAxiosInstance(
  "https://sistemas.cariacica.es.gov.br"
);

// Instância para API interna (se necessário)
export const apiAxios = createAxiosInstance(
  process.env.NEXT_PUBLIC_API_BASE_URL
);

// Instância padrão
export const defaultAxios = createAxiosInstance();

// Função para fazer requisições com autenticação
export const authenticatedRequest = async <T>(
  config: AxiosRequestConfig,
  accessToken?: string
): Promise<T> => {
  const requestConfig = {
    ...config,
    headers: {
      ...config.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  };

  const response = await authAxios.request<T>(requestConfig);
  return response.data;
};

// Função para fazer requisições de autenticação (form-urlencoded)
export const authRequest = async <T>(
  url: string,
  data: Record<string, any>,
  headers?: Record<string, string>
): Promise<T> => {
  try {
    // Converte o objeto para URLSearchParams para form-urlencoded
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const response = await authAxios.post<T>(url, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...headers,
      },
    });

    return response.data;
  } catch (error) {
    // Re-throw o erro para que seja tratado pelo interceptor
    throw new Error(error as string);
  }
};

export default defaultAxios;
