# Configuração de Ambiente

## Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5433/event_ticket"

# External Auth API - Prefeitura de Cariacica
EXTERNAL_AUTH_CLIENT_ID="your_client_id_here"
EXTERNAL_AUTH_CLIENT_SECRET="your_client_secret_here"

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

## Configuração da API Externa

### 1. Obter Credenciais da API

Para integrar com a API da Prefeitura de Cariacica, você precisa:

1. **Client ID**: Identificador da aplicação
2. **Client Secret**: Chave secreta da aplicação

Entre em contato com a equipe de TI da prefeitura para obter essas credenciais.

### 2. Endpoints da API

- **Token Endpoint**: `https://sistemas.cariacica.es.gov.br/authserver/OAuth20/Token`
- **User Info Endpoint**: `https://sistemas.cariacica.es.gov.br/authserver/OAuth20/UserInfo` (assumido)

### 3. Fluxo de Autenticação

1. O usuário insere email e senha
2. A aplicação envia as credenciais para a API externa
3. A API retorna um access_token e refresh_token
4. A aplicação usa o access_token para obter informações do usuário
5. As informações são mapeadas para o formato interno da aplicação

## Mapeamento de Roles

A aplicação mapeia as roles da API externa para roles internas:

- `ADMIN` ou `ADMINISTRADOR` → `ADMIN`
- `SORTEADOR` ou `ORGANIZADOR` → `SORTEADOR`
- `USER`, `USUARIO` ou `FUNCIONARIO` → `USER`

## Segurança

- Os tokens são armazenados no localStorage (considerar usar httpOnly cookies em produção)
- O refresh_token é usado automaticamente quando o access_token expira
- Todas as requisições para a API externa são feitas via HTTPS

## Troubleshooting

### Erro de Credenciais

- Verifique se o `EXTERNAL_AUTH_CLIENT_ID` e `EXTERNAL_AUTH_CLIENT_SECRET` estão corretos
- Confirme se a aplicação está registrada na API da prefeitura

### Erro de Conexão

- Verifique se a URL da API está acessível
- Confirme se não há bloqueios de firewall ou proxy

### Erro de Mapeamento de Roles

- Verifique se o campo `role` está sendo retornado pela API
- Ajuste o mapeamento no arquivo `lib/services/hybrid-auth.service.ts` se necessário
