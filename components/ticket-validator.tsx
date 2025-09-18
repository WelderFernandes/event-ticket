"use client";

import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateTicketSchema } from "@/lib/validations";
import { validateTicket, type ActionResult } from "@/lib/actions/tickets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useState } from "react";

export function TicketValidator() {
  const [state, formAction, isPending] = useActionState(validateTicket, {
    success: false,
    message: "",
  });

  const {
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(validateTicketSchema),
  });

  const qrCodeValue = watch("qrCode");

  // Monitorar mudanças no estado da action
  useEffect(() => {
    if (state.success || state.message) {
      // Opcional: resetar o formulário após validação bem-sucedida
      // reset();
    }
  }, [state, reset]);

  const getStatusIcon = (success: boolean, message: string) => {
    if (success) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }

    if (
      message.includes("já foi utilizado") ||
      message.includes("já foi usado")
    ) {
      return <Clock className="h-4 w-4 text-yellow-600" />;
    }

    if (message.includes("cancelado")) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }

    return <AlertCircle className="h-4 w-4 text-red-600" />;
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

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        {/* Campo hidden para qrCode */}
        <input type="hidden" name="qrCode" value={qrCodeValue || ""} />

        <div className="space-y-2">
          <Label htmlFor="qrCode">Código do QR Code *</Label>
          <Input
            id="qrCode"
            {...register("qrCode")}
            placeholder="Digite ou cole o código do QR code"
            disabled={isPending}
            className="font-mono text-sm"
          />
          {errors.qrCode && (
            <p className="text-sm text-red-500">{errors.qrCode.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Validando..." : "Validar Ticket"}
        </Button>
      </form>

      {/* Mensagens de Status */}
      {state.message && (
        <Alert variant={state.success ? "default" : "destructive"}>
          {getStatusIcon(state.success, state.message)}
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {/* Resultado da Validação */}
      {state.data && (
        <Card
          className={`border-2 ${
            state.success
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center gap-2 ${
                state.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {getStatusIcon(state.success, state.message)}
              {state.success ? "Ticket Validado!" : "Ticket Inválido"}
            </CardTitle>
            <CardDescription>
              {state.success
                ? "O ticket foi validado com sucesso e marcado como usado"
                : "Não foi possível validar este ticket"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Informações do Ticket */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">
                  Número do Ticket:
                </p>
                <Badge variant="outline" className="font-mono">
                  {state.data.ticket.ticketNumber}
                </Badge>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Status:</p>
                {getStatusBadge(state.data.ticket.status)}
              </div>
            </div>

            {/* Informações do Participante */}
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground">Participante:</p>
              <div className="bg-white p-4 rounded-lg border space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {state.data.ticket.participant.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {state.data.ticket.participant.email}
                  </span>
                </div>
                {state.data.ticket.participant.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {state.data.ticket.participant.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Informações do Evento */}
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground">Evento:</p>
              <div className="bg-white p-4 rounded-lg border space-y-2">
                <h4 className="font-medium">{state.data.ticket.event.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(state.data.ticket.event.date).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </div>
                {state.data.ticket.event.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{state.data.ticket.event.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                Criado em:{" "}
                {new Date(state.data.ticket.createdAt).toLocaleString("pt-BR")}
              </p>
              {state.data.ticket.usedAt && (
                <p>
                  Usado em:{" "}
                  {new Date(state.data.ticket.usedAt).toLocaleString("pt-BR")}
                </p>
              )}
            </div>

            {/* Ações */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  reset();
                }}
                className="flex-1"
              >
                Validar Outro Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
