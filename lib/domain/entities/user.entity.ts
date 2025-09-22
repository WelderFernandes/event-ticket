export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SORTEADOR = "SORTEADOR",
}

export interface User {
  id: string;
  nome: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  nome: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserData {
  nome?: string;
  email?: string;
  role?: UserRole;
}
