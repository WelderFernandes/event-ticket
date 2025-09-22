import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createEvent, getEvents } from "@/lib/actions/events";
import { Calendar, Plus, Users, Ticket } from "lucide-react";
import { EventForm } from "@/components/event-form";
import { EventList } from "@/components/event-list";
import {
  BreadcrumbItemProps,
  CustomBreadcumb,
} from "@/components/common/CustomBreadcumb";

export default async function EventsPage() {
  const events = await getEvents();
  const breadcrumbItemsData: BreadcrumbItemProps[] = [
    {
      label: "Dashboard",
      href: "./panel",
    },
  ];

  return (
    <div className="space-y-6">
      <CustomBreadcumb title="Dashboard" items={breadcrumbItemsData} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gerenciar Eventos
          </h1>
          <p className="text-muted-foreground">
            Crie e gerencie seus eventos para geração de tickets
          </p>
        </div>
      </div>
      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Eventos
                </p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Participantes
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Ticket className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tickets Gerados
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário de Criação */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Criar Novo Evento
              </CardTitle>
              <CardDescription>
                Preencha as informações para criar um novo evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Carregando...</div>}>
                <EventForm action={createEvent} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Eventos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Eventos Criados
              </CardTitle>
              <CardDescription>
                Visualize e gerencie todos os seus eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Carregando eventos...</div>}>
                <EventList events={events} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
