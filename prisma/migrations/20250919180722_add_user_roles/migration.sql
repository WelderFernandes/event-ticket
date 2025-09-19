-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN', 'SORTEADOR');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER';
