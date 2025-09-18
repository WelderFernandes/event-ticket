"use server";

import { prisma } from "@/lib/prisma";
import { createEventSchema, type CreateEventInput } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { serializeEvent, serializeEvents } from "@/lib/utils/serialization";

export async function createEvent(formData: FormData) {
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      location: formData.get("location") as string,
      maxTickets: formData.get("maxTickets")
        ? Number(formData.get("maxTickets"))
        : undefined,
    };

    const validatedData = createEventSchema.parse(rawData);

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        organizerId: "default-organizer", // TODO: Implementar autenticação
        price: validatedData.maxTickets ? null : null, // Preço opcional
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: serializeEvent(event),
    };
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}

export async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Converter Decimal para number para compatibilidade com componentes cliente
    return serializeEvents(events);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return [];
  }
}

export async function getEventById(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            tickets: true,
          },
        },
        _count: {
          select: {
            participants: true,
            tickets: true,
          },
        },
      },
    });

    if (!event) {
      return { success: false, error: "Evento não encontrado" };
    }

    // Converter Decimal para number para compatibilidade com componentes cliente
    return { success: true, data: serializeEvent(event) };
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erro interno do servidor",
    };
  }
}
