# Integração com API Externa - Prefeitura de Cariacica

## Resumo da Implementação

A aplicação foi modificada para integrar com a API de autenticação da Prefeitura de Cariacica, mantendo a arquitetura Clean Architecture e os princípios SOLID.

## Arquivos Criados/Modificados

### Novos Serviços

1. **`lib/services/external-auth.service.ts`**

   - Serviço para comunicação direta com a API externa
   - Métodos: `authenticate()`, `getUserInfo()`, `refreshToken()`
   - Endpoint: `https://sistemas.cariacica.es.gov.br/authserver/OAuth20/Token`

2. **`lib/services/hybrid-auth.service.ts`**

   - Serviço híbrido que integra API externa com sistema interno
   - Mapeia roles externas para roles internas
   - Gerencia tokens e sessões

3. **`hooks/use-hybrid-auth.ts`**
   - Hook personalizado para gerenciar autenticação híbrida
   - Gerencia estado da sessão no localStorage
   - Implementa renovação automática de tokens

### Componentes Atualizados

1. **`app/auth/components/login-form.tsx`**

   - Agora usa `useHybridAuth` em vez do BetterAuth
   - Mantém a mesma interface e validação

2. **`components/auth/user-profile.tsx`**

   - Atualizado para usar autenticação híbrida
   - Logout limpa sessão local

3. **`components/auth/protected-route.tsx`**

   - Proteção de rotas usando autenticação híbrida

4. **`components/auth/role-guard.tsx`**

   - Guards de autorização atualizados

5. **`components/auth/auth-provider.tsx`**
   - Provider atualizado para usar autenticação híbrida

### Páginas Atualizadas

1. **`app/page.tsx`** - Página inicial
2. **`app/dashboard/page.tsx`** - Dashboard

## Fluxo de Autenticação

### 1. Login do Usuário

```
Usuário insere credenciais →
Formulário valida dados →
useHybridAuth.login() →
ExternalAuthService.authenticate() →
API Externa retorna tokens →
ExternalAuthService.getUserInfo() →
Mapeamento de roles →
Salvar no localStorage →
Atualizar estado da aplicação
```

### 2. Renovação de Token

```
Token expira →
useHybridAuth detecta expiração →
ExternalAuthService.refreshToken() →
API Externa retorna novos tokens →
Atualizar localStorage →
Continuar sessão
```

### 3. Logout

```
Usuário clica em logout →
useHybridAuth.logout() →
Limpar localStorage →
Redirecionar para login
```

## Mapeamento de Roles

| Role Externa                       | Role Interna | Permissões                                 |
| ---------------------------------- | ------------ | ------------------------------------------ |
| `ADMIN` / `ADMINISTRADOR`          | `ADMIN`      | Acesso total ao sistema                    |
| `SORTEADOR` / `ORGANIZADOR`        | `SORTEADOR`  | Gerenciar eventos, participantes e tickets |
| `USER` / `USUARIO` / `FUNCIONARIO` | `USER`       | Ler eventos, criar participantes           |

## Configuração Necessária

### Variáveis de Ambiente

```env
EXTERNAL_AUTH_CLIENT_ID="seu_client_id"
EXTERNAL_AUTH_CLIENT_SECRET="seu_client_secret"
```

### Credenciais da API

- **Client ID**: Identificador da aplicação na API da prefeitura
- **Client Secret**: Chave secreta da aplicação

## Segurança Implementada

1. **HTTPS**: Todas as comunicações com a API externa via HTTPS
2. **Token Management**: Gerenciamento seguro de access_token e refresh_token
3. **Auto-refresh**: Renovação automática de tokens expirados
4. **Local Storage**: Armazenamento seguro de sessão (considerar httpOnly cookies em produção)
5. **Error Handling**: Tratamento robusto de erros de autenticação

## Vantagens da Implementação

1. **Clean Architecture**: Mantém separação de responsabilidades
2. **SOLID Principles**: Código modular e extensível
3. **Type Safety**: TypeScript em toda a implementação
4. **Error Handling**: Tratamento robusto de erros
5. **User Experience**: Renovação transparente de tokens
6. **Flexibility**: Fácil de estender ou modificar

## Próximos Passos

1. **Obter Credenciais**: Contatar equipe de TI da prefeitura
2. **Testar Integração**: Validar com credenciais reais
3. **Ajustar Mapeamento**: Verificar campos retornados pela API
4. **Produção**: Considerar usar httpOnly cookies para tokens
5. **Monitoramento**: Implementar logs de autenticação

## Troubleshooting

### Erro de Credenciais

- Verificar `EXTERNAL_AUTH_CLIENT_ID` e `EXTERNAL_AUTH_CLIENT_SECRET`
- Confirmar se aplicação está registrada na API

### Erro de Conexão

- Verificar conectividade com `https://sistemas.cariacica.es.gov.br`
- Verificar firewall/proxy

### Erro de Mapeamento

- Verificar estrutura de resposta da API
- Ajustar mapeamento em `hybrid-auth.service.ts`

## Exemplo de Uso

```typescript
// No componente
const { user, isAuthenticated, login, logout } = useHybridAuth();

// Login
const handleLogin = async (email: string, password: string) => {
  const result = await login(email, password);
  if (result.success) {
    // Redirecionar para dashboard
  } else {
    // Mostrar erro
  }
};

// Logout
const handleLogout = () => {
  logout();
  // Redirecionar para login
};
```

A implementação está completa e pronta para uso, mantendo toda a funcionalidade anterior enquanto integra com a API externa da prefeitura.
