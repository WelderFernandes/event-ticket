import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { QrCodeScannerComponent } from "@/components/qr-code-scanner";

export default function ValidationPage() {
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
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

      {/* Scanner Card - Ocupa toda a tela restante */}
      <div className="flex-1 p-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Scanner de QR Code
            </CardTitle>
            <CardDescription>
              Use a câmera para escanear o QR code do ticket
            </CardDescription>
          </CardHeader>
          <CardContent className="h-full flex flex-col">
            <Suspense fallback={<div>Carregando scanner...</div>}>
              <QrCodeScannerComponent />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
