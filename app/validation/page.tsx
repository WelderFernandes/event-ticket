import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { TicketValidator } from "@/components/ticket-validator";
import { QrCodeScannerComponent } from "@/components/qr-code-scanner";

export default function ValidationPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Validação de Tickets
          </h1>
          <p className="text-muted-foreground">
            Valide tickets através de QR codes para controle de acesso aos
            eventos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <QrCode className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner de QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Scanner de QR Code
            </CardTitle>
            <CardDescription>
              Use a câmera para escanear o QR code do ticket
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Carregando scanner...</div>}>
              <QrCodeScannerComponent />
            </Suspense>
          </CardContent>
        </Card>

        {/* Validação Manual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Validação Manual
            </CardTitle>
            <CardDescription>
              Digite o código do QR code manualmente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Carregando validador...</div>}>
              <TicketValidator />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Instruções de Validação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
                <h3 className="font-medium">Escanear QR Code</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-10">
                Use a câmera para escanear o QR code do ticket ou digite o
                código manualmente
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <h3 className="font-medium">Verificar Status</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-10">
                O sistema verificará se o ticket é válido e se ainda não foi
                usado
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">3</span>
                </div>
                <h3 className="font-medium">Confirmar Entrada</h3>
              </div>
              <p className="text-sm text-muted-foreground ml-10">
                Se válido, o ticket será marcado como usado e a entrada será
                liberada
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status dos Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tickets Válidos
                </p>
                <p className="text-2xl font-bold text-green-600">-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tickets Inválidos
                </p>
                <p className="text-2xl font-bold text-red-600">-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tickets Já Usados
                </p>
                <p className="text-2xl font-bold text-yellow-600">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
