import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateTicket } from "@/lib/actions/tickets";
import { getEvents } from "@/lib/actions/events";
import { TicketGeneratorForm } from "@/components/ticket-generator-form";
import { TicketList } from "@/components/ticket-list";
import { QrCode, Ticket, Users, CheckCircle } from "lucide-react";

export default async function TicketsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gerenciar Tickets
          </h1>
          <p className="text-muted-foreground">
            Gere e gerencie tickets únicos para seus eventos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Ticket className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Tickets
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tickets Usados
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tickets Ativos
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Geração */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Gerar Novo Ticket
              </CardTitle>
              <CardDescription>
                Crie um ticket único com QR code para um participante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Carregando...</div>}>
                <TicketGeneratorForm events={events} action={generateTicket} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Tickets */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Tickets Gerados
              </CardTitle>
              <CardDescription>
                Visualize todos os tickets gerados para os eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Carregando tickets...</div>}>
                <TicketList />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
