"use client";

import { useState, useEffect } from "react";
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
import { Ticket, Search, Filter, Download, Eye } from "lucide-react";
import { getAllTickets } from "@/lib/actions/tickets";
import { TicketViewModal } from "./ticket-view-modal";

interface TicketData {
  id: string;
  ticketNumber: string;
  qrCode: string;
  status: "ACTIVE" | "USED" | "CANCELLED";
  usedAt?: Date;
  createdAt: Date;
  participant: {
    name: string;
    email: string;
    phone?: string;
  };
  event: {
    title: string;
    date: Date;
    location?: string;
  };
}

export function TicketList() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter, eventFilter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const allTickets: TicketData[] = await getAllTickets();
      setTickets(allTickets);
    } catch (error) {
      console.error("Erro ao carregar tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.participant.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          ticket.participant.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    // Filtro por evento
    if (eventFilter !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.event.title === eventFilter
      );
    }

    setFilteredTickets(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Ativo
          </Badge>
        );
      case "USED":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Usado
          </Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUniqueEvents = () => {
    const events = tickets.map((ticket) => ticket.event.title);
    return Array.from(new Set(events));
  };

  const handleViewTicket = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Estatísticas */}
      {tickets.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Mostrando {filteredTickets.length} de {tickets.length} tickets
              </p>
              <div className="flex gap-4">
                <span className="text-green-600">
                  {tickets.filter((t) => t.status === "ACTIVE").length} Ativos
                </span>
                <span className="text-blue-600">
                  {tickets.filter((t) => t.status === "USED").length} Usados
                </span>
                <span className="text-red-600">
                  {tickets.filter((t) => t.status === "CANCELLED").length}{" "}
                  Cancelados
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou número do ticket..."
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
            <SelectItem value="ACTIVE">Ativos</SelectItem>
            <SelectItem value="USED">Usados</SelectItem>
            <SelectItem value="CANCELLED">Cancelados</SelectItem>
          </SelectContent>
        </Select>

        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Eventos</SelectItem>
            {getUniqueEvents().map((event) => (
              <SelectItem key={event} value={event}>
                {event}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Tickets */}
      {filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhum ticket encontrado
            </h3>
            <p className="text-muted-foreground">
              {tickets.length === 0
                ? "Ainda não há tickets gerados. Crie o primeiro ticket usando o formulário ao lado."
                : "Nenhum ticket corresponde aos filtros aplicados."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">
                        {ticket.ticketNumber}
                      </h3>
                      {getStatusBadge(ticket.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">
                          Participante
                        </p>
                        <p className="font-medium">{ticket.participant.name}</p>
                        <p className="text-muted-foreground">
                          {ticket.participant.email}
                        </p>
                        {ticket.participant.phone && (
                          <p className="text-muted-foreground">
                            {ticket.participant.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-muted-foreground">
                          Evento
                        </p>
                        <p className="font-medium">{ticket.event.title}</p>
                        <p className="text-muted-foreground">
                          {new Date(ticket.event.date).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                        {ticket.event.location && (
                          <p className="text-muted-foreground">
                            {ticket.event.location}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>
                        Criado em:{" "}
                        {new Date(ticket.createdAt).toLocaleString("pt-BR")}
                      </p>
                      {ticket.usedAt && (
                        <p>
                          Usado em:{" "}
                          {new Date(ticket.usedAt).toLocaleString("pt-BR")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <Eye className="h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      QR Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Visualização do Ticket */}
      <TicketViewModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
