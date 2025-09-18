/**
 * Utilitários para serialização de dados do Prisma para componentes cliente
 */

/**
 * Converte um objeto Decimal do Prisma para number ou null
 */
export function serializeDecimal(decimal: any): number | null {
  if (decimal === null || decimal === undefined) {
    return null;
  }
  return Number(decimal);
}

/**
 * Serializa um evento do Prisma, convertendo campos Decimal para number
 */
export function serializeEvent(event: any) {
  return {
    ...event,
    price: serializeDecimal(event.price),
  };
}

/**
 * Serializa um ticket do Prisma, convertendo campos Decimal do evento relacionado
 */
export function serializeTicket(ticket: any) {
  return {
    ...ticket,
    event: ticket.event ? serializeEvent(ticket.event) : ticket.event,
  };
}

/**
 * Serializa uma lista de eventos
 */
export function serializeEvents(events: any[]) {
  return events.map(serializeEvent);
}

/**
 * Serializa uma lista de tickets
 */
export function serializeTickets(tickets: any[]) {
  return tickets.map(serializeTicket);
}
