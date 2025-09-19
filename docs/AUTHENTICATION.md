# Sistema de Autenticação e Autorização

Este documento descreve a implementação do sistema de autenticação e autorização do Event Ticket, seguindo os princípios de Clean Architecture, DDD e SOLID.

## Arquitetura

### Clean Architecture

O sistema está organizado em camadas bem definidas:

- **Domain**: Entidades e regras de negócio
- **Application**: Casos de uso e lógica de aplicação
- **Infrastructure**: Comunicação com banco de dados
- **Presentation**: Interface do usuário

### Estrutura de Pastas

```
lib/
├── domain/
│   ├── entities/
│   │   └── user.entity.ts
│   └── repositories/
│       └── user.repository.ts
├── application/
│   ├── use-cases/
│   │   └── auth/
│   │       ├── register-user.use-case.ts
│   │       └── authenticate-user.use-case.ts
│   └── authorization/
│       ├── abilities.ts
│       ├── authorization-context.tsx
│       └── permissions.ts
└── auth.ts
```

## Autenticação

### BetterAuth

Utilizamos o BetterAuth para gerenciar a autenticação:

- **Email/Password**: Autenticação tradicional
- **Sessões**: Gerenciamento automático de sessões
- **Roles**: Suporte a roles de usuário

### Configuração

```typescript
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
    },
  },
});
```

## Autorização

### CASL

Utilizamos o CASL para controle de acesso baseado em roles:

#### Roles Disponíveis

- **USER**: Usuário comum
- **ADMIN**: Administrador do sistema
- **SORTEADOR**: Responsável por sortear e gerenciar eventos

#### Permissões

```typescript
const PERMISSIONS = {
  EVENT: {
    CREATE: [UserRole.ADMIN, UserRole.SORTEADOR],
    READ: [UserRole.ADMIN, UserRole.SORTEADOR, UserRole.USER],
    UPDATE: [UserRole.ADMIN, UserRole.SORTEADOR],
    DELETE: [UserRole.ADMIN],
  },
  // ... outras permissões
};
```

### Uso dos Guards

#### RoleGuard

```tsx
<RoleGuard action="create" subject="Event">
  <Button>Criar Evento</Button>
</RoleGuard>
```

#### RoleBasedRender

```tsx
<RoleBasedRender roles={[UserRole.ADMIN, UserRole.SORTEADOR]}>
  <AdminPanel />
</RoleBasedRender>
```

## Formulários

### Validação com Zod

Cada componente possui seu próprio schema de validação:

```typescript
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});
```

### Formik

Utilizamos o Formik para gerenciamento de formulários:

```tsx
<Formik
  initialValues={{ email: "", password: "" }}
  validationSchema={loginSchema}
  onSubmit={handleSubmit}
>
  {({ errors, touched }) => <Form>{/* Campos do formulário */}</Form>}
</Formik>
```

## Hooks

### useAuth

Hook personalizado para gerenciar autenticação:

```typescript
const { user, isAuthenticated, isAdmin, isSorteador, isUser } = useAuth();
```

### useAuthorization

Hook para verificar permissões:

```typescript
const ability = useAuthorization();
const canCreateEvent = ability.can("create", "Event");
```

## Componentes

### ProtectedRoute

Protege rotas que requerem autenticação:

```tsx
<ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
  <AdminPage />
</ProtectedRoute>
```

### UserProfile

Componente para exibir informações do usuário logado:

```tsx
<UserProfile />
```

## Responsividade

Todos os componentes são responsivos e seguem as melhores práticas:

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: Uso consistente dos breakpoints do Tailwind
- **Flexbox/Grid**: Layouts flexíveis e adaptáveis

## Exemplos de Uso

### Página Protegida

```tsx
export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
      <div>
        <h1>Painel Administrativo</h1>
        {/* Conteúdo apenas para admins */}
      </div>
    </ProtectedRoute>
  );
}
```

### Renderização Condicional

```tsx
export default function Dashboard() {
  const { isAdmin, isSorteador } = useAuth();

  return (
    <div>
      <RoleBasedRender roles={[UserRole.ADMIN]}>
        <AdminStats />
      </RoleBasedRender>

      <RoleBasedRender roles={[UserRole.SORTEADOR]}>
        <EventManager />
      </RoleBasedRender>
    </div>
  );
}
```

## Segurança

### Validação

- **Cliente**: Validação com Zod para melhor UX
- **Servidor**: Validação obrigatória no backend
- **Sanitização**: Limpeza de dados de entrada

### Autorização

- **Verificação de Roles**: Em todas as operações sensíveis
- **Princípio do Menor Privilégio**: Usuários têm apenas as permissões necessárias
- **Auditoria**: Log de ações importantes

## Testes

### Estrutura de Testes

```typescript
describe("Authentication", () => {
  it("should allow admin to create events", () => {
    // Teste de autorização
  });

  it("should prevent user from accessing admin panel", () => {
    // Teste de proteção de rota
  });
});
```

## Manutenção

### Adicionando Novas Roles

1. Atualizar o enum `UserRole`
2. Definir permissões em `permissions.ts`
3. Atualizar as abilities no CASL
4. Testar as novas permissões

### Adicionando Novas Permissões

1. Definir a permissão em `permissions.ts`
2. Atualizar as abilities do CASL
3. Implementar nos componentes necessários
4. Adicionar testes

## Troubleshooting

### Problemas Comuns

1. **Usuário não consegue fazer login**

   - Verificar se o email está correto
   - Verificar se a senha atende aos critérios
   - Verificar logs do servidor

2. **Permissões não funcionam**

   - Verificar se o usuário tem a role correta
   - Verificar se as abilities estão configuradas
   - Verificar se o contexto de autorização está presente

3. **Formulários não validam**
   - Verificar se o schema Zod está correto
   - Verificar se o Formik está configurado
   - Verificar se os erros estão sendo exibidos
