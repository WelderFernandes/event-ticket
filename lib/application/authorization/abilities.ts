import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";
import { User, UserRole } from "../../domain/entities/user.entity";

export type Actions = "create" | "read" | "update" | "delete" | "manage";
export type Subjects = "Event" | "Participant" | "Ticket" | "User" | "all";

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function createAbilityFor(user: User | null): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  if (!user) {
    // Usuário não autenticado - apenas leitura de eventos públicos
    can("read", "Event");
    return build();
  }

  switch (user.role) {
    case UserRole.ADMIN:
      // Admin pode fazer tudo
      can("manage", "all");
      break;

    case UserRole.SORTEADOR:
      // Sorteador pode gerenciar eventos, participantes e tickets
      can("manage", "Event");
      can("manage", "Participant");
      can("manage", "Ticket");
      can("read", "User");
      break;

    case UserRole.USER:
      // Usuário comum pode ler eventos e criar participantes
      can("read", "Event");
      can("create", "Participant");
      can("read", "Participant");
      can("read", "Ticket");
      break;

    default:
      // Sem permissões especiais
      can("read", "Event");
  }

  return build();
}
