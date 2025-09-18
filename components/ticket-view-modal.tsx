"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  QrCode,
  Download,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { generateQRCode } from "@/lib/qrcode";

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
    price?: number;
  };
}

interface TicketViewModalProps {
  ticket: TicketData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketViewModal({
  ticket,
  isOpen,
  onClose,
}: TicketViewModalProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  useEffect(() => {
    if (ticket && isOpen) {
      generateQRCodeImage();
    }
  }, [ticket, isOpen]);

  const generateQRCodeImage = async () => {
    if (!ticket) return;

    setIsGeneratingQR(true);
    try {
      const qrCodeDataURL = await generateQRCode(ticket.qrCode);
      setQrCodeImage(qrCodeDataURL);
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  if (!ticket) return null;

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

  const downloadQRCode = () => {
    if (!qrCodeImage) return;

    const link = document.createElement("a");
    link.href = qrCodeImage;
    link.download = `ticket-${ticket.ticketNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Detalhes do Ticket
          </DialogTitle>
          <DialogDescription>
            Informações completas do ticket {ticket.ticketNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Cabeçalho do Ticket */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{ticket.ticketNumber}</CardTitle>
                {getStatusBadge(ticket.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Criado em</p>
                  <p className="font-medium">
                    {new Date(ticket.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                {ticket.usedAt && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Usado em</p>
                    <p className="font-medium">
                      {new Date(ticket.usedAt).toLocaleString("pt-BR")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações do Participante */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-4 w-4" />
                Participante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{ticket.participant.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{ticket.participant.email}</span>
                </div>
                {ticket.participant.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{ticket.participant.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações do Evento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-4 w-4" />
                Evento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-lg">
                    {ticket.event.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(ticket.event.date).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {ticket.event.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{ticket.event.location}</span>
                  </div>
                )}
                {ticket.event.price !== undefined && ticket.event.price > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Preço:</span>
                    <span className="font-semibold text-lg">
                      R$ {ticket.event.price.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <QrCode className="h-4 w-4" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  {isGeneratingQR ? (
                    <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : qrCodeImage ? (
                    <img
                      src={qrCodeImage}
                      alt="QR Code do Ticket"
                      className="w-32 h-32 rounded"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  QR Code: {ticket.qrCode}
                </p>
                <Button
                  onClick={downloadQRCode}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={!qrCodeImage || isGeneratingQR}
                >
                  <Download className="h-4 w-4" />
                  {isGeneratingQR ? "Gerando..." : "Baixar QR Code"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
