"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import {
  User as UserIcon,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  Calendar,
  Hash,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getUsers, type GetUsersResponse } from "@/lib/actions/users";
import { User } from "@/lib/domain/entities/user.entity";
import { Badge } from "@/components/ui/badge";
import { ReusableDataTable } from "@/components/common/reusable-data-table";
import { DataTableColumn } from "@/components/common/reusable-data-table";

export default function UsersPage() {
  const [search] = useQueryState("search", parseAsString.withDefault(""));
  const [role] = useQueryState(
    "role",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const [emailVerified] = useQueryState(
    "emailVerified",
    parseAsString.withDefault("")
  );

  const [data, setData] = useState<GetUsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getUsers({
        search,
        role,
        status,
        emailVerified: emailVerified ? emailVerified === "true" : undefined,
      });
      setData(result);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  }, [search, role, status, emailVerified]);

  // Buscar dados quando os filtros mudarem
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = useMemo<DataTableColumn<User>[]>(
    () => [
      {
        id: "nome",
        accessorKey: "nome",
        header: "Nome",
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue()}</div>
        ),
        meta: {
          label: "Nome",
          placeholder: "Buscar por nome...",
          variant: "text",
          icon: UserIcon,
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
            {cell.getValue()}
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
        id: "cpf",
        accessorKey: "cpf",
        header: "CPF",
        cell: ({ cell }) => (
          <div className="font-mono text-sm">{cell.getValue()}</div>
        ),
        meta: {
          label: "CPF",
          placeholder: "Buscar por CPF...",
          variant: "text",
        },
        enableColumnFilter: true,
      },
      {
        id: "matricula",
        accessorKey: "matricula",
        header: "Matrícula",
        cell: ({ cell }) => (
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            {cell.getValue()}
          </div>
        ),
        meta: {
          label: "Matrícula",
          placeholder: "Buscar por matrícula...",
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Função",
        cell: ({ cell }) => {
          const role = cell.getValue();
          const roleLabels = {
            USER: "Usuário",
            ADMIN: "Administrador",
            SORTEADOR: "Sorteador",
          };

          return (
            <Badge variant="outline" className="capitalize">
              <Shield className="h-3 w-3 mr-1" />
              {roleLabels[role as keyof typeof roleLabels] || role}
            </Badge>
          );
        },
        meta: {
          label: "Função",
          variant: "multiSelect",
          options: [
            { label: "Usuário", value: "USER", icon: UserIcon },
            { label: "Administrador", value: "ADMIN", icon: Shield },
            { label: "Sorteador", value: "SORTEADOR", icon: Shield },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ cell }) => {
          const status = cell.getValue();
          const isActive = status === "Ativo";
          const Icon = isActive ? CheckCircle : XCircle;

          return (
            <Badge
              variant={isActive ? "default" : "secondary"}
              className="capitalize"
            >
              <Icon className="h-3 w-3 mr-1" />
              {status}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: [
            { label: "Ativo", value: "Ativo", icon: CheckCircle },
            { label: "Inativo", value: "Inativo", icon: XCircle },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "emailVerified",
        accessorKey: "emailVerified",
        header: "Email Verificado",
        cell: ({ cell }) => {
          const verified = cell.getValue();
          const Icon = verified ? CheckCircle : XCircle;

          return (
            <Badge variant={verified ? "default" : "secondary"}>
              <Icon className="h-3 w-3 mr-1" />
              {verified ? "Verificado" : "Não verificado"}
            </Badge>
          );
        },
        meta: {
          label: "Email Verificado",
          variant: "select",
          options: [
            { label: "Verificado", value: "true", icon: CheckCircle },
            { label: "Não verificado", value: "false", icon: XCircle },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Data de Criação",
        cell: ({ cell }) => {
          const date = cell.getValue();
          return (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {format(new Date(date), "dd/MM/yyyy", { locale: ptBR })}
            </div>
          );
        },
      },
    ],
    []
  );

  const actions = [
    {
      label: "Editar",
      onClick: (user: User) => {
        console.log("Editar usuário:", user);
        // Implementar ação de edição
      },
    },
    {
      label: "Ver detalhes",
      onClick: (user: User) => {
        console.log("Ver detalhes do usuário:", user);
        // Implementar ação de visualização
      },
    },
    {
      label: "Excluir",
      onClick: (user: User) => {
        console.log("Excluir usuário:", user);
        // Implementar ação de exclusão
      },
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
      </div>

      <ReusableDataTable
        data={data?.users || []}
        columns={columns}
        pageCount={data?.totalPages || 1}
        isLoading={isLoading}
        emptyMessage="Nenhum usuário encontrado."
        enableSelection={true}
        enableActions={true}
        actions={actions}
        initialSorting={[{ id: "nome", desc: false }]}
        pinnedColumns={{ right: ["actions"] }}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
