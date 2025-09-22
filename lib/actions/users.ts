"use server";

import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/domain/entities/user.entity";

export interface GetUsersParams {
  search?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetUsersResponse {
  users: Array<{
    id: string;
    nome: string;
    email: string;
    emailVerified: boolean;
    role: UserRole;
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
}: GetUsersParams = {}): Promise<GetUsersResponse> {
  try {
    const skip = (page - 1) * perPage;

    // Construir filtros de busca
    const where = search
      ? {
          OR: [
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
          ],
        }
      : {};

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
          emailVerified: true,
          role: true,
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
