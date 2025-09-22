"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  Ticket,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  location: string | null;
  maxTickets: number | null;
  price: any; // Decimal type from Prisma
  isActive: boolean;
  organizerId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && event.isActive) ||
      (statusFilter === "inactive" && !event.isActive);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Ativo
      </Badge>
    ) : (
      <Badge variant="destructive">Inativo</Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEventUpcoming = (date: Date) => {
    return new Date(date) > new Date();
  };

  const isEventToday = (date: Date) => {
    const today = new Date();
    const eventDate = new Date(date);
    return eventDate.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, descrição ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Eventos */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {events.length === 0
                ? "Nenhum evento encontrado"
                : "Nenhum evento corresponde aos filtros"}
            </h3>
            <p className="text-muted-foreground">
              {events.length === 0
                ? "Crie seu primeiro evento usando o formulário ao lado."
                : "Tente ajustar os filtros de busca."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(event.isActive)}
                          {isEventToday(event.date) && (
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800"
                            >
                              Hoje
                            </Badge>
                          )}
                          {isEventUpcoming(event.date) && (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800"
                            >
                              Próximo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Data:</span>
                          <span>{formatDate(event.date)}</span>
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Local:</span>
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        {event.maxTickets && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Limite:</span>
                            <span>{event.maxTickets} participantes</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Tickets:</span>
                          <span>0 gerados</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>Criado em: {formatDate(event.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Link href={`/painel/tickets?eventId=${event.id}`}>
                        <Ticket className="h-4 w-4" />
                        Gerar Tickets
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Estatísticas */}
      {events.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Mostrando {filteredEvents.length} de {events.length} eventos
              </p>
              <div className="flex gap-4">
                <span className="text-green-600">
                  {events.filter((e) => e.isActive).length} Ativos
                </span>
                <span className="text-red-600">
                  {events.filter((e) => !e.isActive).length} Inativos
                </span>
                <span className="text-blue-600">
                  {events.filter((e) => isEventUpcoming(e.date)).length}{" "}
                  Próximos
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
