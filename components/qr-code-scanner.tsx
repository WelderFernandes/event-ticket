"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QrCode, Camera, CameraOff, AlertCircle } from "lucide-react";
import { validateTicket, type ActionResult } from "@/lib/actions/tickets";

export function QrCodeScannerComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const [lastScannedCode, setLastScannedCode] = useState<string>("");
  const [validationResult, setValidationResult] = useState<ActionResult | null>(
    null
  );

  // Simulação de scanner QR Code (em produção, use uma biblioteca como @zxing/library)
  const startScanning = async () => {
    try {
      setError("");
      setIsScanning(true);

      // Solicitar acesso à câmera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Câmera traseira se disponível
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simular detecção de QR Code (em produção, implemente detecção real)
      simulateQRDetection();
    } catch (err) {
      console.error("Erro ao acessar câmera:", err);
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setError("");
  };

  // Simulação de detecção de QR Code
  const simulateQRDetection = () => {
    // Em produção, substitua por detecção real de QR Code
    const interval = setInterval(() => {
      if (!isScanning) {
        clearInterval(interval);
        return;
      }

      // Simular detecção ocasional de QR Code
      if (Math.random() < 0.1) {
        // 10% de chance a cada verificação
        const mockQRCode = `QR-${Date.now().toString(36)}-${Math.random()
          .toString(36)
          .substring(2, 8)}`;
        handleQRCodeDetected(mockQRCode);
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleQRCodeDetected = async (qrCode: string) => {
    if (qrCode === lastScannedCode) return; // Evitar validações duplicadas

    setLastScannedCode(qrCode);
    stopScanning();

    // Validar o ticket
    const formData = new FormData();
    formData.append("qrCode", qrCode);

    const result = await validateTicket(
      { success: false, message: "" },
      formData
    );
    setValidationResult(result);
  };

  const validateManualCode = async (qrCode: string) => {
    const formData = new FormData();
    formData.append("qrCode", qrCode);

    const result = await validateTicket(
      { success: false, message: "" },
      formData
    );
    setValidationResult(result);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Área do Scanner */}
      <div className="relative">
        <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          {isScanning ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-lg"
                playsInline
                muted
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white rounded-lg bg-transparent">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-600">
                  Scanner de QR Code
                </p>
                <p className="text-sm text-gray-500">
                  Clique para iniciar a câmera
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="flex justify-center mt-4">
          {!isScanning ? (
            <Button onClick={startScanning} className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Iniciar Scanner
            </Button>
          ) : (
            <Button
              onClick={stopScanning}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <CameraOff className="h-4 w-4" />
              Parar Scanner
            </Button>
          )}
        </div>
      </div>

      {/* Erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Resultado da Validação */}
      {validationResult && (
        <Card
          className={`border-2 ${
            validationResult.success
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div
                className={`text-2xl font-bold ${
                  validationResult.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {validationResult.success ? "✓ VÁLIDO" : "✗ INVÁLIDO"}
              </div>
              <p
                className={`text-sm ${
                  validationResult.success ? "text-green-700" : "text-red-700"
                }`}
              >
                {validationResult.message}
              </p>
              {validationResult.data?.ticket && (
                <div className="mt-4 p-3 bg-white rounded border text-left">
                  <p className="font-medium">
                    Ticket: {validationResult.data.ticket.ticketNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {validationResult.data.ticket.participant.name}
                  </p>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setValidationResult(null);
                  setLastScannedCode("");
                }}
                className="mt-2"
              >
                Escanear Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      <Card>
        <CardContent className="p-4">
          <div className="text-sm space-y-2">
            <h4 className="font-medium">Como usar:</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Clique em "Iniciar Scanner" para ativar a câmera</li>
              <li>Posicione o QR code do ticket dentro da área de leitura</li>
              <li>Aguarde a validação automática</li>
              <li>O resultado será exibido instantaneamente</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
