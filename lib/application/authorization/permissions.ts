import { UserRole } from "../../domain/entities/user.entity";

export const PERMISSIONS = {
  // Event permissions
  EVENT: {
    CREATE: [UserRole.ADMIN, UserRole.SORTEADOR],
    READ: [UserRole.ADMIN, UserRole.SORTEADOR, UserRole.USER],
    UPDATE: [UserRole.ADMIN, UserRole.SORTEADOR],
    DELETE: [UserRole.ADMIN],
  },

  // Participant permissions
  PARTICIPANT: {
    CREATE: [UserRole.ADMIN, UserRole.SORTEADOR, UserRole.USER],
    READ: [UserRole.ADMIN, UserRole.SORTEADOR],
    UPDATE: [UserRole.ADMIN, UserRole.SORTEADOR],
    DELETE: [UserRole.ADMIN],
  },

  // Ticket permissions
  TICKET: {
    CREATE: [UserRole.ADMIN, UserRole.SORTEADOR],
    READ: [UserRole.ADMIN, UserRole.SORTEADOR, UserRole.USER],
    UPDATE: [UserRole.ADMIN, UserRole.SORTEADOR],
    DELETE: [UserRole.ADMIN],
    VALIDATE: [UserRole.ADMIN, UserRole.SORTEADOR],
  },

  // User permissions
  USER: {
    CREATE: [UserRole.ADMIN],
    READ: [UserRole.ADMIN],
    UPDATE: [UserRole.ADMIN],
    DELETE: [UserRole.ADMIN],
  },
} as const;

export function hasPermission(
  userRole: UserRole,
  resource: keyof typeof PERMISSIONS,
  action: keyof (typeof PERMISSIONS)[typeof resource]
): boolean {
  return PERMISSIONS[resource][action].includes(userRole);
}
