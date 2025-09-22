"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/domain/entities/user.entity";

export interface GetUsersParams {
  search?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  role?: string[];
  status?: string[];
  emailVerified?: boolean;
}

export interface GetUsersResponse {
  users: Array<{
    id: string;
    nome: string;
    email: string;
    cpf: string;
    matricula: number;
    role: UserRole;
    status: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export async function getUsers({
  search = "",
  page = 1,
  perPage = 10,
  sortBy = "nome",
  sortOrder = "asc",
  role = [],
  status = [],
  emailVerified,
}: GetUsersParams = {}): Promise<GetUsersResponse> {
  try {
    const skip = (page - 1) * perPage;

    // Construir filtros de busca
    const where: any = {};

    // Filtro de busca por texto
    if (search) {
      where.OR = [
        {
          nome: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          cpf: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ];
    }

    // Filtro por role
    if (role.length > 0) {
      where.role = {
        in: role,
      };
    }

    // Filtro por status
    if (status.length > 0) {
      where.status = {
        in: status,
      };
    }

    // Filtro por email verificado
    if (emailVerified !== undefined) {
      where.emailVerified = emailVerified;
    }

    // Construir ordenação
    const orderBy = {
      [sortBy]: sortOrder,
    };

    // Buscar usuários e total em paralelo
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          matricula: true,
          role: true,
          status: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return {
      users: users.map((user) => ({
        ...user,
        role: user.role as UserRole,
        status: user.status as string,
      })),
      total,
      page,
      perPage,
      totalPages,
    };
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw new Error("Erro ao buscar usuários");
  }
}
