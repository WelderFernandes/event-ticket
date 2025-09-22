/**
 * Exemplo de como usar o ReusableDataTable em outras páginas
 *
 * Este arquivo demonstra como implementar uma tabela de dados
 * usando o componente ReusableDataTable em qualquer página.
 */

"use client";

import React, { useMemo } from "react";
import { User, Mail, Shield, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  ReusableDataTable,
  type DataTableColumn,
} from "@/components/common/reusable-data-table";
import { Badge } from "@/components/ui/badge";

// Exemplo de interface de dados
interface ExampleData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: Date;
}

// Exemplo de dados mock
const mockData: ExampleData[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@example.com",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@example.com",
    role: "user",
    status: "inactive",
    createdAt: new Date("2024-01-20"),
  },
];

export function ExampleDataTable() {
  // Definir as colunas da tabela
  const columns = useMemo<DataTableColumn<ExampleData>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Nome",
        cell: ({ cell }) => (
          <div className="font-medium">
            {cell.getValue<ExampleData["name"]>()}
          </div>
        ),
        meta: {
          label: "Nome",
          placeholder: "Buscar por nome...",
          variant: "text",
          icon: User,
        },
        enableColumnFilter: true,
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        cell: ({ cell }) => (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            {cell.getValue<ExampleData["email"]>()}
          </div>
        ),
        meta: {
          label: "Email",
          placeholder: "Buscar por email...",
          variant: "text",
          icon: Mail,
        },
        enableColumnFilter: true,
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Função",
        cell: ({ cell }) => {
          const role = cell.getValue<ExampleData["role"]>();
          return (
            <Badge variant="outline" className="capitalize">
              <Shield className="h-3 w-3 mr-1" />
              {role}
            </Badge>
          );
        },
        meta: {
          label: "Função",
          variant: "multiSelect",
          options: [
            { label: "Administrador", value: "admin", icon: Shield },
            { label: "Usuário", value: "user", icon: User },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ cell }) => {
          const status = cell.getValue<ExampleData["status"]>();
          const isActive = status === "active";
          const Icon = isActive ? CheckCircle : XCircle;

          return (
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="capitalize"
            >
              <Icon className="h-3 w-3 mr-1" />
              {isActive ? "Ativo" : "Inativo"}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: [
            { label: "Ativo", value: "active", icon: CheckCircle },
            { label: "Inativo", value: "inactive", icon: XCircle },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Data de Criação",
        cell: ({ cell }) => {
          const date = cell.getValue<ExampleData["createdAt"]>();
          return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
        },
      },
    ],
    []
  );

  // Definir as ações disponíveis
  const actions = [
    {
      label: "Editar",
      onClick: (row: ExampleData) => {
        console.log("Editar:", row);
        // Implementar ação de edição
      },
    },
    {
      label: "Ver detalhes",
      onClick: (row: ExampleData) => {
        console.log("Ver detalhes:", row);
        // Implementar ação de visualização
      },
    },
    {
      label: "Excluir",
      onClick: (row: ExampleData) => {
        console.log("Excluir:", row);
        // Implementar ação de exclusão
      },
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exemplo de Tabela</h1>
        <p className="text-muted-foreground">
          Exemplo de como usar o ReusableDataTable
        </p>
      </div>

      <ReusableDataTable
        data={mockData}
        columns={columns}
        pageCount={1}
        isLoading={false}
        emptyMessage="Nenhum item encontrado."
        enableSelection={true}
        enableActions={true}
        actions={actions}
        initialSorting={[{ id: "name", desc: false }]}
        pinnedColumns={{ right: ["actions"] }}
        getRowId={(row) => row.id}
      />
    </div>
  );
}

/**
 * COMO USAR EM OUTRAS PÁGINAS:
 *
 * 1. Importe o componente:
 *    import { ReusableDataTable, type DataTableColumn } from "@/components/common/reusable-data-table";
 *
 * 2. Defina a interface dos seus dados:
 *    interface MeusDados {
 *      id: string;
 *      nome: string;
 *      // ... outros campos
 *    }
 *
 * 3. Crie as colunas:
 *    const columns = useMemo<DataTableColumn<MeusDados>[]>(() => [
 *      {
 *        id: "nome",
 *        accessorKey: "nome",
 *        header: "Nome",
 *        cell: ({ cell }) => <div>{cell.getValue()}</div>,
 *        meta: {
 *          label: "Nome",
 *          placeholder: "Buscar...",
 *          variant: "text",
 *        },
 *        enableColumnFilter: true,
 *      },
 *      // ... outras colunas
 *    ], []);
 *
 * 4. Defina as ações (opcional):
 *    const actions = [
 *      {
 *        label: "Editar",
 *        onClick: (row) => console.log("Editar", row),
 *      },
 *    ];
 *
 * 5. Use o componente:
 *    <ReusableDataTable
 *      data={meusDados}
 *      columns={columns}
 *      pageCount={totalPages}
 *      isLoading={loading}
 *      actions={actions}
 *      getRowId={(row) => row.id}
 *    />
 *
 * RECURSOS DISPONÍVEIS:
 *
 * - Filtros automáticos na URL (usando nuqs)
 * - Ordenação por múltiplas colunas
 * - Paginação
 * - Seleção de linhas
 * - Ações personalizadas
 * - Filtros avançados
 * - Responsividade
 * - Acessibilidade
 *
 * TIPOS DE FILTROS SUPORTADOS:
 * - text: Busca por texto
 * - number: Filtros numéricos
 * - select: Seleção única
 * - multiSelect: Seleção múltipla
 * - date: Filtros de data
 * - boolean: Filtros booleanos
 */
