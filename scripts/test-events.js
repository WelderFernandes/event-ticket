// Script para testar a funcionalidade de eventos
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testEvents() {
  try {
    console.log("🧪 Testando funcionalidade de eventos...");

    // Testar conexão com o banco
    console.log("📡 Testando conexão com o banco...");
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Conexão com banco OK");

    // Listar eventos existentes
    console.log("📋 Listando eventos existentes...");
    const existingEvents = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    console.log(`📊 Encontrados ${existingEvents.length} eventos:`);
    existingEvents.forEach((event, index) => {
      console.log(`  ${index + 1}. ${event.title} (${event.id})`);
      console.log(`     Data: ${new Date(event.date).toLocaleString("pt-BR")}`);
      console.log(`     Status: ${event.isActive ? "Ativo" : "Inativo"}`);
    });

    // Criar um evento de teste
    console.log("➕ Criando evento de teste...");
    const testEvent = await prisma.event.create({
      data: {
        title: "Evento de Teste - " + new Date().toISOString(),
        description: "Este é um evento criado automaticamente para teste",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias no futuro
        location: "Local de Teste",
        maxTickets: 50,
        organizerId: "test-organizer",
        isActive: true,
      },
    });

    console.log("✅ Evento de teste criado com sucesso!");
    console.log(`   ID: ${testEvent.id}`);
    console.log(`   Nome: ${testEvent.title}`);
    console.log(`   Data: ${new Date(testEvent.date).toLocaleString("pt-BR")}`);

    // Verificar se o evento foi criado
    const createdEvent = await prisma.event.findUnique({
      where: { id: testEvent.id },
    });

    if (createdEvent) {
      console.log("✅ Evento encontrado no banco de dados");
    } else {
      console.log("❌ Erro: Evento não foi encontrado no banco");
    }

    console.log("🎉 Teste concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o teste:", error.message);

    if (error.code === "P1001") {
      console.error(
        "💡 Dica: Verifique se o PostgreSQL está rodando e acessível"
      );
    } else if (error.code === "P2021") {
      console.error(
        "💡 Dica: A tabela não existe. Execute as migrações: npx prisma migrate dev"
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o teste
testEvents();
