"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema } from "@/lib/validations";
import { createEvent } from "@/lib/actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Calendar,
  MapPin,
  Users,
  DollarSign,
} from "lucide-react";
import { useState } from "react";

interface EventFormProps {
  action: (
    formData: FormData
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
}

export function EventForm({ action }: EventFormProps) {
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(createEventSchema),
  });

  const maxTickets = watch("maxTickets");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formData.append(key, value as string);
        }
      });

      const result = await action(formData);

      if (result.success && result.data) {
        setCreatedEvent(result.data);
        reset();
      } else {
        setError(result.error || "Erro ao criar evento");
      }
    } catch (err) {
      setError("Erro interno do servidor");
      console.error("Erro ao criar evento:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nome do Evento */}
        <div className="space-y-2">
          <Label htmlFor="title">Nome do Evento *</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Digite o nome do evento"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Descreva o evento (opcional)"
            disabled={isLoading}
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Data do Evento */}
        <div className="space-y-2">
          <Label htmlFor="date">Data e Hora do Evento *</Label>
          <Input
            id="date"
            type="datetime-local"
            {...register("date")}
            disabled={isLoading}
          />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        {/* Local */}
        <div className="space-y-2">
          <Label htmlFor="location">Local</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="Digite o local do evento (opcional)"
            disabled={isLoading}
          />
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location.message}</p>
          )}
        </div>

        {/* Limite de Tickets */}
        <div className="space-y-2">
          <Label htmlFor="maxTickets">Limite de Participantes</Label>
          <Input
            id="maxTickets"
            type="number"
            min="1"
            {...register("maxTickets", { valueAsNumber: true })}
            placeholder="Número máximo de participantes (opcional)"
            disabled={isLoading}
          />
          {errors.maxTickets && (
            <p className="text-sm text-red-500">{errors.maxTickets.message}</p>
          )}
          {maxTickets && (
            <p className="text-sm text-muted-foreground">
              Máximo de {maxTickets} participantes
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Criando Evento..." : "Criar Evento"}
        </Button>
      </form>

      {/* Mensagens de Status */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Evento Criado */}
      {createdEvent && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Evento Criado com Sucesso!
            </CardTitle>
            <CardDescription>
              O evento foi criado e está pronto para receber participantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">
                  ID do Evento:
                </p>
                <Badge variant="outline" className="font-mono">
                  {createdEvent.id}
                </Badge>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Status:</p>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Ativo
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-muted-foreground">
                Informações do Evento:
              </p>
              <div className="bg-white p-4 rounded-lg border space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{createdEvent.title}</span>
                </div>
                {createdEvent.description && (
                  <p className="text-sm text-muted-foreground">
                    {createdEvent.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(createdEvent.date).toLocaleString("pt-BR")}
                  </span>
                </div>
                {createdEvent.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{createdEvent.location}</span>
                  </div>
                )}
                {createdEvent.maxTickets && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Máximo {createdEvent.maxTickets} participantes</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Criado em:{" "}
                {new Date(createdEvent.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
