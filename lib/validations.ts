import { z } from 'zod'

export const createEventSchema = z.object({
  title: z.string().min(1, 'Nome do evento é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
  location: z.string().optional(),
  maxTickets: z.number().min(1, 'Número máximo de tickets deve ser maior que 0').optional()
})

export const createParticipantSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  eventId: z.string().min(1, 'Evento é obrigatório')
})

export const validateTicketSchema = z.object({
  qrCode: z.string().min(1, 'QR Code é obrigatório')
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export type CreateParticipantInput = z.infer<typeof createParticipantSchema>
export type ValidateTicketInput = z.infer<typeof validateTicketSchema>

