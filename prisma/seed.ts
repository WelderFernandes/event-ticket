import { PrismaClient } from "@prisma/client";
import {
  generateUniqueTicketNumber,
  generateUniqueQRCodeData,
  generateQRCode,
} from "../lib/qrcode";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes
  console.log("🧹 Limpando dados existentes...");
  await prisma.ticket.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.event.deleteMany();

  // Criar eventos de exemplo
  console.log("📅 Criando eventos...");

  const eventos = [
    {
      title: "Conferência de Tecnologia 2024",
      description:
        "A maior conferência de tecnologia do ano, com palestras sobre IA, blockchain e desenvolvimento web.",
      date: new Date("2024-12-15T09:00:00Z"),
      location: "Centro de Convenções São Paulo",
      maxTickets: 500,
      price: 299.99,
      organizerId: "org-001",
    },
    {
      title: "Workshop de React Avançado",
      description:
        "Workshop prático sobre React 19, Server Components e Next.js 15.",
      date: new Date("2024-12-20T14:00:00Z"),
      location: "Escritório TechCorp - Sala 201",
      maxTickets: 30,
      price: 150.0,
      organizerId: "org-001",
    },
    {
      title: "Meetup de Desenvolvedores",
      description: "Encontro mensal da comunidade de desenvolvedores locais.",
      date: new Date("2024-12-25T19:00:00Z"),
      location: "Café Tech - Centro",
      maxTickets: 50,
      price: 0,
      organizerId: "org-002",
    },
    {
      title: "Curso de TypeScript",
      description: "Curso completo de TypeScript do básico ao avançado.",
      date: new Date("2025-01-10T09:00:00Z"),
      location: "Online - Zoom",
      maxTickets: 100,
      price: 199.99,
      organizerId: "org-001",
    },
    {
      title: "Hackathon Inovação 2025",
      description: "48 horas de programação para criar soluções inovadoras.",
      date: new Date("2025-01-20T08:00:00Z"),
      location: "Universidade Tech - Laboratório 3",
      maxTickets: 200,
      price: 0,
      organizerId: "org-003",
    },
  ];

  const eventosCriados = [];
  for (const eventoData of eventos) {
    const evento = await prisma.event.create({
      data: eventoData,
    });
    eventosCriados.push(evento);
    console.log(`✅ Evento criado: ${evento.title}`);
  }

  // Criar participantes e tickets
  console.log("👥 Criando participantes e tickets...");

  const participantes = [
    // Conferência de Tecnologia
    {
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(11) 99999-1111",
      eventId: eventosCriados[0].id,
    },
    {
      name: "Maria Santos",
      email: "maria.santos@email.com",
      phone: "(11) 99999-2222",
      eventId: eventosCriados[0].id,
    },
    {
      name: "Pedro Oliveira",
      email: "pedro.oliveira@email.com",
      phone: "(11) 99999-3333",
      eventId: eventosCriados[0].id,
    },
    {
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "(11) 99999-4444",
      eventId: eventosCriados[0].id,
    },
    {
      name: "Carlos Ferreira",
      email: "carlos.ferreira@email.com",
      phone: "(11) 99999-5555",
      eventId: eventosCriados[0].id,
    },

    // Workshop de React
    {
      name: "Lucas Almeida",
      email: "lucas.almeida@email.com",
      phone: "(11) 99999-6666",
      eventId: eventosCriados[1].id,
    },
    {
      name: "Fernanda Lima",
      email: "fernanda.lima@email.com",
      phone: "(11) 99999-7777",
      eventId: eventosCriados[1].id,
    },
    {
      name: "Rafael Souza",
      email: "rafael.souza@email.com",
      phone: "(11) 99999-8888",
      eventId: eventosCriados[1].id,
    },

    // Meetup
    {
      name: "Juliana Rocha",
      email: "juliana.rocha@email.com",
      phone: "(11) 99999-9999",
      eventId: eventosCriados[2].id,
    },
    {
      name: "Diego Martins",
      email: "diego.martins@email.com",
      phone: "(11) 99999-0000",
      eventId: eventosCriados[2].id,
    },
    {
      name: "Camila Barbosa",
      email: "camila.barbosa@email.com",
      phone: "(11) 99999-1234",
      eventId: eventosCriados[2].id,
    },

    // Curso de TypeScript
    {
      name: "Bruno Carvalho",
      email: "bruno.carvalho@email.com",
      phone: "(11) 99999-5678",
      eventId: eventosCriados[3].id,
    },
    {
      name: "Patricia Gomes",
      email: "patricia.gomes@email.com",
      phone: "(11) 99999-9012",
      eventId: eventosCriados[3].id,
    },

    // Hackathon
    {
      name: "Gabriel Nunes",
      email: "gabriel.nunes@email.com",
      phone: "(11) 99999-3456",
      eventId: eventosCriados[4].id,
    },
    {
      name: "Larissa Vieira",
      email: "larissa.vieira@email.com",
      phone: "(11) 99999-7890",
      eventId: eventosCriados[4].id,
    },
    {
      name: "Thiago Correia",
      email: "thiago.correia@email.com",
      phone: "(11) 99999-2468",
      eventId: eventosCriados[4].id,
    },
  ];

  let ticketsCriados = 0;
  for (const participanteData of participantes) {
    // Criar participante
    const participante = await prisma.participant.create({
      data: {
        name: participanteData.name,
        email: participanteData.email,
        phone: participanteData.phone,
        eventId: participanteData.eventId,
      },
    });

    // Criar ticket para o participante
    const ticketNumber = generateUniqueTicketNumber();
    const qrCodeData = generateUniqueQRCodeData();
    const qrCodeImage = await generateQRCode(qrCodeData);

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        qrCode: qrCodeData,
        participantId: participante.id,
        eventId: participanteData.eventId,
        status: "ACTIVE",
      },
    });

    ticketsCriados++;
    console.log(
      `✅ Ticket criado: ${ticket.ticketNumber} para ${participante.name}`
    );
  }

  // Marcar alguns tickets como usados (para demonstração)
  console.log("🎫 Marcando alguns tickets como usados...");
  const ticketsParaUsar = await prisma.ticket.findMany({
    take: 3,
    where: { status: "ACTIVE" },
  });

  for (const ticket of ticketsParaUsar) {
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: "USED",
        usedAt: new Date(),
      },
    });
    console.log(`✅ Ticket ${ticket.ticketNumber} marcado como usado`);
  }

  // Estatísticas finais
  const totalEventos = await prisma.event.count();
  const totalParticipantes = await prisma.participant.count();
  const totalTickets = await prisma.ticket.count();
  const ticketsUsados = await prisma.ticket.count({
    where: { status: "USED" },
  });
  const ticketsAtivos = await prisma.ticket.count({
    where: { status: "ACTIVE" },
  });

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("📊 Estatísticas:");
  console.log(`   📅 Eventos: ${totalEventos}`);
  console.log(`   👥 Participantes: ${totalParticipantes}`);
  console.log(`   🎫 Tickets: ${totalTickets}`);
  console.log(`   ✅ Tickets Ativos: ${ticketsAtivos}`);
  console.log(`   🔒 Tickets Usados: ${ticketsUsados}`);
  console.log("\n🚀 Banco de dados populado e pronto para uso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
