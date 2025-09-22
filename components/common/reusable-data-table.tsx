"use client";

import React, { useMemo } from "react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";

export interface DataTableColumn<TData> {
  id: string;
  accessorKey?: keyof TData;
  accessorFn?: (row: TData) => any;
  header: string;
  cell?: (props: {
    row: { original: TData };
    cell: { getValue: () => any };
  }) => React.ReactNode;
  meta?: {
    label: string;
    placeholder?: string;
    variant?: "text" | "number" | "select" | "multiSelect" | "date" | "boolean";
    options?: Array<{
      label: string;
      value: string;
      icon?: React.ComponentType;
    }>;
    icon?: React.ComponentType;
  };
  enableColumnFilter?: boolean;
  enableSorting?: boolean;
  enableHiding?: boolean;
  size?: number;
}

export interface ReusableDataTableProps<TData> {
  data: TData[];
  columns: DataTableColumn<TData>[];
  pageCount?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  enableSelection?: boolean;
  enableActions?: boolean;
  actions?: Array<{
    label: string;
    onClick: (row: TData) => void;
    variant?: "default" | "destructive";
  }>;
  initialSorting?: Array<{ id: string; desc: boolean }>;
  pinnedColumns?: { left?: string[]; right?: string[] };
  getRowId?: (row: TData) => string;
}

export function ReusableDataTable<TData>({
  data,
  columns,
  pageCount = 1,
  isLoading = false,
  emptyMessage = "Nenhum resultado encontrado.",
  enableSelection = true,
  enableActions = true,
  actions = [],
  initialSorting = [],
  pinnedColumns = { right: ["actions"] },
  getRowId,
}: ReusableDataTableProps<TData>) {
  const tableColumns = useMemo<ColumnDef<TData>[]>(() => {
    const cols: ColumnDef<TData>[] = [];

    // Coluna de seleção
    if (enableSelection) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Selecionar todos"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Selecionar linha"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      });
    }

    // Colunas de dados
    columns.forEach((column) => {
      cols.push({
        id: column.id,
        accessorKey: column.accessorKey as string,
        accessorFn: column.accessorFn,
        header: ({ column: col }: { column: Column<TData, unknown> }) => (
          <DataTableColumnHeader column={col} title={column.header} />
        ),
        cell: column.cell || (({ cell }) => <div>{cell.getValue()}</div>),
        meta: column.meta,
        enableColumnFilter: column.enableColumnFilter,
        enableSorting: column.enableSorting,
        enableHiding: column.enableHiding,
        size: column.size,
      });
    });

    // Coluna de ações
    if (enableActions && actions.length > 0) {
      cols.push({
        id: "actions",
        cell: function Cell({ row }) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.onClick(row.original)}
                    className={
                      action.variant === "destructive" ? "text-destructive" : ""
                    }
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 32,
      });
    }

    return cols;
  }, [columns, enableSelection, enableActions, actions]);

  const { table } = useDataTable({
    data,
    columns: tableColumns,
    pageCount,
    initialState: {
      sorting: initialSorting,
      columnPinning: pinnedColumns,
    },
    getRowId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableAdvancedToolbar table={table}>
          <DataTableFilterList table={table} />
          <DataTableSortList table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
}
