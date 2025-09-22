"use server";

import { prisma } from "@/lib/prisma";
import {
  createParticipantSchema,
  type CreateParticipantInput,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createParticipant(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      eventId: formData.get("eventId") as string,
    };

    const validatedData = createParticipantSchema.parse(rawData);

    // Verificar se o participante já existe para este evento
    const existingParticipant = await prisma.participant.findUnique({
      where: {
        email_eventId: {
          email: validatedData.email,
          eventId: validatedData.eventId,
        },
      },
    });

    if (existingParticipant) {
      return {
        success: false,
        error: "Este email já está cadastrado para este evento",
      };
    }

    const participant = await prisma.participant.create({
      data: validatedData,
      include: {
        event: true,
      },
    });

    revalidatePath("/painel");
    return { success: true, data: participant };
  } catch (error) {
    console.error("Erro ao criar participante:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

export async function getParticipantsByEvent(eventId: string) {
  try {
    const participants = await prisma.participant.findMany({
      where: { eventId },
      include: {
        tickets: true,
        event: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: participants };
  } catch (error) {
    console.error("Erro ao buscar participantes:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
