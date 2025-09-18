"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  generateQRCode,
  generateUniqueTicketNumber,
  generateUniqueQRCodeData,
} from "@/lib/qrcode";
import {
  createParticipantSchema,
  validateTicketSchema,
} from "@/lib/validations";
import { serializeTicket, serializeTickets } from "@/lib/utils/serialization";

export type ActionResult = {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string[]>;
};

// Gerar ticket para participante
export async function generateTicket(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Validar dados do formulário
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      eventId: formData.get("eventId") as string,
    };

    const validatedData = createParticipantSchema.parse(rawData);

    // Verificar se o evento existe
    const event = await prisma.event.findUnique({
      where: { id: validatedData.eventId },
    });

    if (!event) {
      return {
        success: false,
        message: "Evento não encontrado",
        errors: { eventId: ["Evento não encontrado"] },
      };
    }

    // Verificar se já existe participante com este email no evento
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        email: validatedData.email,
        eventId: validatedData.eventId,
      },
    });

    if (existingParticipant) {
      return {
        success: false,
        message: "Já existe um participante com este email neste evento",
        errors: { email: ["Email já cadastrado para este evento"] },
      };
    }

    // Verificar limite de tickets se definido
    if (event.maxTickets) {
      const currentTicketsCount = await prisma.ticket.count({
        where: { eventId: validatedData.eventId },
      });

      if (currentTicketsCount >= event.maxTickets) {
        return {
          success: false,
          message: "Limite de tickets atingido para este evento",
          errors: { eventId: ["Limite de tickets atingido"] },
        };
      }
    }

    // Gerar dados únicos para o ticket
    const ticketNumber = generateUniqueTicketNumber();
    const qrCodeData = generateUniqueQRCodeData();
    const qrCodeImage = await generateQRCode(qrCodeData);

    // Criar participante e ticket em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Criar participante
      const participant = await tx.participant.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          eventId: validatedData.eventId,
        },
      });

      // Criar ticket
      const ticket = await tx.ticket.create({
        data: {
          ticketNumber,
          qrCode: qrCodeData,
          participantId: participant.id,
          eventId: validatedData.eventId,
          status: "ACTIVE",
        },
        include: {
          participant: true,
          event: true,
        },
      });

      return { participant, ticket, qrCodeImage };
    });

    revalidatePath("/dashboard");
    revalidatePath(`/event/${validatedData.eventId}`);

    return {
      success: true,
      message: "Ticket gerado com sucesso!",
      data: {
        ticket: serializeTicket(result.ticket),
        qrCodeImage: result.qrCodeImage,
      },
    };
  } catch (error) {
    console.error("Erro ao gerar ticket:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        message: "Dados inválidos",
        errors: { general: ["Verifique os dados informados"] },
      };
    }

    return {
      success: false,
      message: "Erro interno do servidor",
      errors: { general: ["Tente novamente mais tarde"] },
    };
  }
}

// Validar ticket via QR Code
export async function validateTicket(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      qrCode: formData.get("qrCode") as string,
    };

    const validatedData = validateTicketSchema.parse(rawData);

    // Buscar ticket pelo QR Code
    const ticket = await prisma.ticket.findUnique({
      where: { qrCode: validatedData.qrCode },
      include: {
        participant: true,
        event: true,
      },
    });

    if (!ticket) {
      return {
        success: false,
        message: "Ticket não encontrado",
        errors: { qrCode: ["QR Code inválido"] },
      };
    }

    // Verificar se o ticket já foi usado
    if (ticket.status === "USED") {
      return {
        success: false,
        message: "Ticket já foi utilizado",
        data: {
          ticket: serializeTicket(ticket),
          usedAt: ticket.usedAt,
        },
      };
    }

    // Verificar se o ticket foi cancelado
    if (ticket.status === "CANCELLED") {
      return {
        success: false,
        message: "Ticket foi cancelado",
        data: {
          ticket: serializeTicket(ticket),
        },
      };
    }

    // Marcar ticket como usado
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: "USED",
        usedAt: new Date(),
      },
      include: {
        participant: true,
        event: true,
      },
    });

    revalidatePath("/validation");

    return {
      success: true,
      message: "Ticket validado com sucesso!",
      data: {
        ticket: serializeTicket(updatedTicket),
      },
    };
  } catch (error) {
    console.error("Erro ao validar ticket:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        message: "QR Code inválido",
        errors: { qrCode: ["Formato de QR Code inválido"] },
      };
    }

    return {
      success: false,
      message: "Erro interno do servidor",
      errors: { general: ["Tente novamente mais tarde"] },
    };
  }
}

// Buscar ticket por QR Code (para visualização)
export async function getTicketByQRCode(qrCode: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { qrCode },
      include: {
        participant: true,
        event: true,
      },
    });

    return ticket;
  } catch (error) {
    console.error("Erro ao buscar ticket:", error);
    return null;
  }
}

// Listar todos os tickets
export async function getAllTickets() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        participant: true,
        event: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return serializeTickets(tickets);
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    return [];
  }
}

// Listar tickets de um evento
export async function getEventTickets(eventId: string) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { eventId },
      include: {
        participant: true,
        event: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return serializeTickets(tickets);
  } catch (error) {
    console.error("Erro ao buscar tickets do evento:", error);
    return [];
  }
}

// Estatísticas de tickets
export async function getTicketStats(eventId: string) {
  try {
    const [total, used, active, cancelled] = await Promise.all([
      prisma.ticket.count({ where: { eventId } }),
      prisma.ticket.count({ where: { eventId, status: "USED" } }),
      prisma.ticket.count({ where: { eventId, status: "ACTIVE" } }),
      prisma.ticket.count({ where: { eventId, status: "CANCELLED" } }),
    ]);

    return { total, used, active, cancelled };
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return { total: 0, used: 0, active: 0, cancelled: 0 };
  }
}
