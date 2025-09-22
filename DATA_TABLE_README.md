# Data Table - Sistema de Listagem com Filtros

Este documento descreve como usar o sistema de Data Table implementado com o Dice UI, nuqs e TanStack Table.

## 🚀 Funcionalidades Implementadas

### ✅ Página de Usuários

- **Localização**: `app/painel/users/page.tsx`
- **Funcionalidades**:
  - Listagem de usuários com paginação
  - Filtros por nome, email, CPF, matrícula
  - Filtros por função (USER, ADMIN, SORTEADOR)
  - Filtros por status (Ativo/Inativo)
  - Filtros por email verificado
  - Ordenação por qualquer coluna
  - Seleção múltipla de linhas
  - Ações (Editar, Ver detalhes, Excluir)
  - Filtros sincronizados com a URL

### ✅ Componente Reutilizável

- **Localização**: `components/common/reusable-data-table.tsx`
- **Funcionalidades**:
  - Componente genérico para qualquer tipo de dados
  - Configuração flexível de colunas
  - Suporte a diferentes tipos de filtros
  - Ações personalizáveis
  - Integração com nuqs para URL state

### ✅ Server Actions

- **Localização**: `lib/actions/users.ts`
- **Funcionalidades**:
  - Busca de usuários com Prisma
  - Filtros avançados
  - Paginação server-side
  - Ordenação server-side

## 📦 Dependências Instaladas

```bash
# Já instaladas no projeto:
- @tanstack/react-table@^8.21.3
- nuqs@^2.6.0
- lucide-react@^0.544.0
- date-fns@^4.1.0

# Componentes do Dice UI instalados:
- data-table (componente principal)
- data-table-sort-list (lista de ordenação)
- data-table-filter-list (lista de filtros)
```

## 🛠️ Como Usar o Componente Reutilizável

### 1. Importar o Componente

```typescript
import {
  ReusableDataTable,
  type DataTableColumn,
} from "@/components/common/reusable-data-table";
```

### 2. Definir a Interface dos Dados

```typescript
interface MeusDados {
  id: string;
  nome: string;
  email: string;
  status: "ativo" | "inativo";
  createdAt: Date;
}
```

### 3. Configurar as Colunas

```typescript
const columns = useMemo<DataTableColumn<MeusDados>[]>(
  () => [
    {
      id: "nome",
      accessorKey: "nome",
      header: "Nome",
      cell: ({ cell }) => <div className="font-medium">{cell.getValue()}</div>,
      meta: {
        label: "Nome",
        placeholder: "Buscar por nome...",
        variant: "text",
        icon: User,
      },
      enableColumnFilter: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ cell }) => {
        const status = cell.getValue();
        return (
          <Badge variant={status === "ativo" ? "default" : "secondary"}>
            {status}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: [
          { label: "Ativo", value: "ativo", icon: CheckCircle },
          { label: "Inativo", value: "inativo", icon: XCircle },
        ],
      },
      enableColumnFilter: true,
    },
  ],
  []
);
```

### 4. Definir Ações (Opcional)

```typescript
const actions = [
  {
    label: "Editar",
    onClick: (row: MeusDados) => {
      console.log("Editar:", row);
      // Implementar ação de edição
    },
  },
  {
    label: "Excluir",
    onClick: (row: MeusDados) => {
      console.log("Excluir:", row);
      // Implementar ação de exclusão
    },
    variant: "destructive" as const,
  },
];
```

### 5. Usar o Componente

```typescript
<ReusableDataTable
  data={meusDados}
  columns={columns}
  pageCount={totalPages}
  isLoading={loading}
  emptyMessage="Nenhum item encontrado."
  enableSelection={true}
  enableActions={true}
  actions={actions}
  initialSorting={[{ id: "nome", desc: false }]}
  pinnedColumns={{ right: ["actions"] }}
  getRowId={(row) => row.id}
/>
```

## 🎯 Tipos de Filtros Suportados

### Text

```typescript
meta: {
  label: "Nome",
  placeholder: "Buscar por nome...",
  variant: "text",
  icon: User,
}
```

### Number

```typescript
meta: {
  label: "Idade",
  placeholder: "Buscar por idade...",
  variant: "number",
}
```

### Select (Seleção Única)

```typescript
meta: {
  label: "Status",
  variant: "select",
  options: [
    { label: "Ativo", value: "ativo", icon: CheckCircle },
    { label: "Inativo", value: "inativo", icon: XCircle },
  ],
}
```

### MultiSelect (Seleção Múltipla)

```typescript
meta: {
  label: "Função",
  variant: "multiSelect",
  options: [
    { label: "Admin", value: "admin", icon: Shield },
    { label: "User", value: "user", icon: User },
  ],
}
```

### Date

```typescript
meta: {
  label: "Data de Criação",
  variant: "date",
}
```

### Boolean

```typescript
meta: {
  label: "Ativo",
  variant: "boolean",
}
```

## 🔗 Integração com URL (nuqs)

O sistema automaticamente sincroniza filtros, ordenação e paginação com a URL:

- **Filtros**: `?search=joão&role=admin,user&status=ativo`
- **Ordenação**: `?sort=nome:asc,createdAt:desc`
- **Paginação**: `?page=2&perPage=20`

### Exemplo de Uso com nuqs

```typescript
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

export default function MinhaPage() {
  const [search] = useQueryState("search", parseAsString.withDefault(""));
  const [role] = useQueryState(
    "role",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  // Os filtros são automaticamente aplicados na tabela
  // e sincronizados com a URL
}
```

## 🎨 Personalização

### Cores e Estilos

O componente usa o sistema de design do shadcn/ui e pode ser personalizado através das classes CSS do Tailwind.

### Ícones

Use ícones do Lucide React para personalizar as colunas:

```typescript
import { User, Mail, Shield, Calendar } from "lucide-react";

meta: {
  icon: User, // Ícone para a coluna
  options: [
    { label: "Admin", value: "admin", icon: Shield }, // Ícone para opções
  ],
}
```

## 📱 Responsividade

O componente é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop**: Mostra todas as colunas
- **Tablet**: Oculta colunas menos importantes
- **Mobile**: Modo compacto com colunas essenciais

## ♿ Acessibilidade

- Suporte completo a leitores de tela
- Navegação por teclado
- Indicadores de foco
- Labels ARIA apropriados
- Contraste adequado

## 🚀 Próximos Passos

Para usar em outras páginas:

1. **Copie o exemplo**: Use `components/common/data-table-example.tsx` como base
2. **Adapte as colunas**: Configure as colunas para seus dados específicos
3. **Implemente Server Actions**: Crie actions para buscar dados do servidor
4. **Configure filtros**: Defina os tipos de filtros necessários
5. **Teste a funcionalidade**: Verifique filtros, ordenação e paginação

## 📝 Exemplo Completo

Veja o arquivo `components/common/data-table-example.tsx` para um exemplo completo de implementação.

## 🔧 Troubleshooting

### Erro de Módulo Não Encontrado

Se houver erros de importação, verifique se:

- O arquivo `components/common/reusable-data-table.tsx` existe
- O TypeScript está configurado corretamente
- As dependências estão instaladas

### Filtros Não Funcionam

Verifique se:

- O `NuqsAdapter` está configurado no layout principal
- Os filtros estão habilitados com `enableColumnFilter: true`
- O `meta.variant` está definido corretamente

### Performance

Para grandes volumes de dados:

- Use paginação server-side
- Implemente debounce nos filtros
- Considere virtualização para listas muito grandes
