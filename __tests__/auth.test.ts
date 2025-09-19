import { describe, it, expect, beforeEach } from "@jest/globals";
import { createAbilityFor } from "../lib/application/authorization/abilities";
import { User, UserRole } from "../lib/domain/entities/user.entity";

describe("Authentication and Authorization", () => {
  let adminUser: User;
  let sorteadorUser: User;
  let regularUser: User;

  beforeEach(() => {
    adminUser = {
      id: "1",
      name: "Admin User",
      email: "admin@test.com",
      emailVerified: true,
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sorteadorUser = {
      id: "2",
      name: "Sorteador User",
      email: "sorteador@test.com",
      emailVerified: true,
      role: UserRole.SORTEADOR,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    regularUser = {
      id: "3",
      name: "Regular User",
      email: "user@test.com",
      emailVerified: true,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  describe("CASL Abilities", () => {
    it("should allow admin to manage all resources", () => {
      const ability = createAbilityFor(adminUser);

      expect(ability.can("manage", "all")).toBe(true);
      expect(ability.can("create", "Event")).toBe(true);
      expect(ability.can("delete", "User")).toBe(true);
    });

    it("should allow sorteador to manage events, participants and tickets", () => {
      const ability = createAbilityFor(sorteadorUser);

      expect(ability.can("create", "Event")).toBe(true);
      expect(ability.can("create", "Participant")).toBe(true);
      expect(ability.can("create", "Ticket")).toBe(true);
      expect(ability.can("read", "User")).toBe(true);
      expect(ability.can("delete", "User")).toBe(false);
    });

    it("should allow regular user to read events and create participants", () => {
      const ability = createAbilityFor(regularUser);

      expect(ability.can("read", "Event")).toBe(true);
      expect(ability.can("create", "Participant")).toBe(true);
      expect(ability.can("read", "Ticket")).toBe(true);
      expect(ability.can("create", "Event")).toBe(false);
      expect(ability.can("delete", "Event")).toBe(false);
    });

    it("should not allow unauthenticated user to perform most actions", () => {
      const ability = createAbilityFor(null);

      expect(ability.can("read", "Event")).toBe(true);
      expect(ability.can("create", "Event")).toBe(false);
      expect(ability.can("create", "Participant")).toBe(false);
    });
  });

  describe("User Roles", () => {
    it("should correctly identify admin role", () => {
      expect(adminUser.role).toBe(UserRole.ADMIN);
    });

    it("should correctly identify sorteador role", () => {
      expect(sorteadorUser.role).toBe(UserRole.SORTEADOR);
    });

    it("should correctly identify user role", () => {
      expect(regularUser.role).toBe(UserRole.USER);
    });
  });
});
