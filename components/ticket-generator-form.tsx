"use client";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createParticipantSchema } from "@/lib/validations";
import { generateTicket, type ActionResult } from "@/lib/actions/tickets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  date: Date;
  location: string | null;
  maxTickets: number | null;
}

interface TicketGeneratorFormProps {
  events: Event[];
  action: (
    prevState: ActionResult,
    formData: FormData
  ) => Promise<ActionResult>;
}

export function TicketGeneratorForm({
  events,
  action,
}: TicketGeneratorFormProps) {
  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    message: "",
  });

  const [generatedTicket, setGeneratedTicket] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(createParticipantSchema),
  });

  const selectedEventId = watch("eventId");
  const selectedEvent = events.find((event) => event.id === selectedEventId);

  // Monitorar mudanças no estado da action
  useEffect(() => {
    if (state.success && state.data) {
      setGeneratedTicket(state.data);
      reset();
    }
  }, [state, reset]);

  const downloadQRCode = () => {
    if (generatedTicket?.qrCodeImage) {
      const link = document.createElement("a");
      link.href = generatedTicket.qrCodeImage;
      link.download = `ticket-${generatedTicket.ticket.ticketNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        {/* Campo hidden para eventId */}
        <input type="hidden" name="eventId" value={selectedEventId || ""} />

        {/* Seleção do Evento */}
        <div className="space-y-2">
          <Label htmlFor="eventId">Evento *</Label>
          <Select onValueChange={(value) => setValue("eventId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um evento" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{event.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("pt-BR")}
                      {event.location && ` • ${event.location}`}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.eventId && (
            <p className="text-sm text-red-500">{errors.eventId.message}</p>
          )}
        </div>

        {/* Informações do Participante */}
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Digite o nome completo"
            disabled={isPending}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Digite o email"
            disabled={isPending}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone (Opcional)</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="Digite o telefone"
            disabled={isPending}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Informações do Evento Selecionado */}
        {selectedEvent && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h4 className="font-medium">Informações do Evento</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(selectedEvent.date).toLocaleDateString("pt-BR")}
                  </p>
                  {selectedEvent.location && (
                    <p>
                      <strong>Local:</strong> {selectedEvent.location}
                    </p>
                  )}
                  {selectedEvent.maxTickets && (
                    <p>
                      <strong>Limite de Tickets:</strong>{" "}
                      {selectedEvent.maxTickets}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Gerando Ticket..." : "Gerar Ticket"}
        </Button>
      </form>

      {/* Mensagens de Status */}
      {state.message && (
        <Alert variant={state.success ? "default" : "destructive"}>
          {state.success ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {/* Ticket Gerado */}
      {generatedTicket && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Ticket Gerado com Sucesso!
            </CardTitle>
            <CardDescription>
              O ticket foi criado e está pronto para uso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Número do Ticket:</p>
                <Badge variant="outline">
                  {generatedTicket.ticket.ticketNumber}
                </Badge>
              </div>
              <div>
                <p className="font-medium">Status:</p>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Ativo
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Participante:</p>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Nome:</strong>{" "}
                  {generatedTicket.ticket.participant.name}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {generatedTicket.ticket.participant.email}
                </p>
                {generatedTicket.ticket.participant.phone && (
                  <p>
                    <strong>Telefone:</strong>{" "}
                    {generatedTicket.ticket.participant.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">QR Code:</p>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded border">
                  <img
                    src={generatedTicket.qrCodeImage}
                    alt="QR Code do Ticket"
                    className="w-24 h-24"
                  />
                </div>
                <Button
                  onClick={downloadQRCode}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Baixar QR Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
