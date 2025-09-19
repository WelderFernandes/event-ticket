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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  QrCode,
  Camera,
  CameraOff,
  AlertCircle,
  Scan,
  CheckCircle,
  XCircle,
  ArrowLeft,
  HelpCircle,
} from "lucide-react";
import { validateTicket, type ActionResult } from "@/lib/actions/tickets";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

export function QrCodeScannerComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const [lastScannedCode, setLastScannedCode] = useState<string>("");
  const [validationResult, setValidationResult] = useState<ActionResult | null>(
    null
  );
  const [isReading, setIsReading] = useState(false);
  const [scanAttempts, setScanAttempts] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [showFullscreenResult, setShowFullscreenResult] = useState(false);
  const [isAutoDismissing, setIsAutoDismissing] = useState(false);
  const [lastDetectionTime, setLastDetectionTime] = useState<number>(0);

  // Iniciar scanner real de QR Code
  const startScanning = async () => {
    try {
      setError("");
      setIsScanning(true);
      setIsReading(false);
      setIsVideoLoading(true);
      setScanAttempts(0);

      console.log("🎥 Iniciando scanner de QR Code...");

      // Primeiro, configurar o stream de vídeo manualmente
      console.log("📱 Solicitando acesso à câmera...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Câmera traseira se disponível
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Aguardar o vídeo carregar
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().then(() => {
                console.log("📹 Stream de vídeo configurado com sucesso");
                console.log("📐 Dimensões do vídeo:", {
                  videoWidth: videoRef.current?.videoWidth,
                  videoHeight: videoRef.current?.videoHeight,
                  clientWidth: videoRef.current?.clientWidth,
                  clientHeight: videoRef.current?.clientHeight,
                });
                setIsVideoLoading(false);
                resolve();
              });
            };
          }
        });
      }

      // Agora iniciar a decodificação
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      console.log("🔍 Iniciando decodificação de QR Code...");

      try {
        // Usar decodeFromVideoDevice com o stream já configurado
        const result = await reader.decodeFromVideoDevice(
          null, // Usar câmera padrão
          videoRef.current!,
          (result: any, error: any) => {
            if (result) {
              console.log("✅ QR Code detectado:", result.getText());
              handleQRCodeDetected(result.getText());
            } else if (error && !(error instanceof NotFoundException)) {
              console.log("❌ Erro na leitura:", error.message);
              setScanAttempts((prev) => prev + 1);
              setIsReading(false);
            } else {
              // NotFoundException é normal - significa que não encontrou QR code ainda
              setIsReading(true);
            }
          }
        );
      } catch (decodeError) {
        console.warn("⚠️ Erro na decodificação, usando fallback:", decodeError);
        // Fallback: apenas mostrar o vídeo sem decodificação automática
        setIsReading(true);
      }

      console.log("📹 Scanner iniciado com sucesso");
    } catch (err) {
      console.error("❌ Erro ao acessar câmera:", err);
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
      setIsScanning(false);
      setIsReading(false);
    }
  };

  const stopScanning = () => {
    console.log("🛑 Parando scanner...");

    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setIsReading(false);
    setIsVideoLoading(false);
    setError("");
    setScanAttempts(0);
  };

  const handleQRCodeDetected = async (qrCode: string) => {
    console.log("🔍 Processando QR Code detectado:", qrCode);

    // Verificações de segurança
    if (!qrCode || qrCode.trim() === "") {
      console.log("⚠️ QR Code vazio, ignorando...");
      return;
    }

    if (qrCode === lastScannedCode) {
      console.log("⚠️ QR Code já foi processado, ignorando...");
      return; // Evitar validações duplicadas
    }

    if (showFullscreenResult) {
      console.log("⚠️ Já processando resultado, ignorando nova detecção...");
      return;
    }

    // Debounce: evitar detecções muito rápidas (menos de 2 segundos)
    const now = Date.now();
    if (now - lastDetectionTime < 2000) {
      console.log("⚠️ Detecção muito rápida, ignorando...");
      return;
    }
    setLastDetectionTime(now);

    setLastScannedCode(qrCode);
    setIsReading(false);

    // Parar o scanner imediatamente após detectar o QR code
    stopScanning();

    console.log("⏱️ Timestamp da leitura:", new Date().toISOString());

    try {
      console.log("🔐 Iniciando validação do ticket...");

      // Validar o ticket
      const formData = new FormData();
      formData.append("qrCode", qrCode);

      const result = await validateTicket(
        { success: false, message: "" },
        formData
      );

      console.log("📋 Resultado da validação:", result);
      setValidationResult(result);

      // Mostrar resultado em tela cheia
      setShowFullscreenResult(true);
      setIsAutoDismissing(false);

      if (result.success) {
        console.log("✅ Ticket validado com sucesso!");
      } else {
        console.log("❌ Falha na validação:", result.message);
      }

      // Auto-dismiss após 4 segundos
      setTimeout(() => {
        setIsAutoDismissing(true);
        setTimeout(() => {
          setShowFullscreenResult(false);
          setValidationResult(null);
          setLastScannedCode("");
          setScanAttempts(0);
        }, 500); // Tempo da animação de saída
      }, 4000);
    } catch (error) {
      console.error("💥 Erro durante validação:", error);
      setValidationResult({
        success: false,
        message: "Erro interno durante a validação",
      });
      setShowFullscreenResult(true);
      setIsAutoDismissing(false);

      // Auto-dismiss também para erros
      setTimeout(() => {
        setIsAutoDismissing(true);
        setTimeout(() => {
          setShowFullscreenResult(false);
          setValidationResult(null);
          setLastScannedCode("");
          setScanAttempts(0);
        }, 500);
      }, 4000);
    }
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
    <div className="h-full flex flex-col">
      {/* Área do Scanner - Ocupa toda a altura disponível */}
      <div className="flex-1 relative">
        <div className="h-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          {isScanning ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-lg"
                playsInline
                muted
              />

              {/* Overlay com instruções e feedback */}
              <div className="absolute inset-0 flex flex-col">
                {/* Instruções no topo */}
                <div className="bg-black/70 text-white p-3 text-center text-sm">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Scan className="h-4 w-4" />
                    <span className="font-medium">
                      Posicione o QR Code na área de leitura
                    </span>
                  </div>
                  <p className="text-xs opacity-90">
                    Mantenha o código estável e bem iluminado
                  </p>
                </div>

                {/* Área de leitura central */}
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="relative">
                    <div
                      className={`w-48 h-48 border-2 rounded-lg bg-transparent transition-all duration-300 ${
                        isReading
                          ? "border-green-400 shadow-lg shadow-green-400/50"
                          : "border-white"
                      }`}
                    >
                      {/* Cantos da área de leitura */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white rounded-br-lg"></div>

                      {/* Indicador de leitura */}
                      {isReading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-pulse">
                            <Scan className="h-8 w-8 text-green-400" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status na parte inferior */}
                <div className="bg-black/70 text-white p-3 text-center text-sm">
                  <div className="flex items-center justify-center gap-2">
                    {isVideoLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Carregando câmera...</span>
                      </>
                    ) : isReading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Lendo QR Code...</span>
                      </>
                    ) : (
                      <>
                        <QrCode className="h-4 w-4" />
                        <span>Aguardando QR Code</span>
                      </>
                    )}
                  </div>
                  {scanAttempts > 0 && (
                    <p className="text-xs opacity-75 mt-1">
                      Tentativas: {scanAttempts}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <QrCode className="h-24 w-24 text-gray-400 mx-auto" />
              <div>
                <p className="text-xl font-medium text-gray-600">
                  Scanner de QR Code
                </p>
                <p className="text-sm text-gray-500">
                  Clique em "Iniciar Scanner" para ativar a câmera
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4 px-4 sm:px-0">
          {!isScanning ? (
            <Button
              onClick={startScanning}
              className="flex items-center gap-2 w-full sm:w-auto"
              size="lg"
            >
              <Camera className="h-4 w-4" />
              Iniciar Scanner
            </Button>
          ) : (
            <>
              <Button
                onClick={stopScanning}
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto"
                size="lg"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-auto"
                    size="lg"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Instruções
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Instruções de Uso do Scanner
                    </DialogTitle>
                    <DialogDescription>
                      Siga estas instruções para usar o scanner de QR codes de
                      forma eficiente
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Instruções principais */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Scan className="h-4 w-4" />
                        Como usar o Scanner:
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>
                          <strong>Iniciar:</strong> Clique em "Iniciar Scanner"
                          para ativar a câmera
                        </li>
                        <li>
                          <strong>Posicionamento:</strong> Posicione o QR code
                          do ticket dentro da área de leitura branca
                        </li>
                        <li>
                          <strong>Estabilidade:</strong> Mantenha o código
                          estável e bem iluminado
                        </li>
                        <li>
                          <strong>Distância:</strong> Mantenha uma distância de
                          15-30cm da câmera
                        </li>
                        <li>
                          <strong>Validação:</strong> Aguarde a validação
                          automática
                        </li>
                        <li>
                          <strong>Resultado:</strong> O resultado será exibido
                          instantaneamente
                        </li>
                      </ol>
                    </div>

                    {/* Dicas */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h5 className="font-medium text-blue-800 mb-3 text-sm">
                        💡 Dicas para melhor leitura:
                      </h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Use boa iluminação (evite sombras)</li>
                        <li>• Mantenha o QR code plano e sem dobras</li>
                        <li>• Evite reflexos na tela do celular</li>
                        <li>• Se não ler, tente mover o código lentamente</li>
                        <li>• Mantenha o celular estável</li>
                        <li>• Use a câmera traseira se disponível</li>
                      </ul>
                    </div>

                    {/* Status de validação */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">
                        Status de Validação:
                      </h5>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-700">
                            Verde: Ticket válido e liberado
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-red-700">
                            Vermelho: Ticket inválido ou já usado
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
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

      {/* Overlay de Resultado em Tela Cheia */}
      {showFullscreenResult && validationResult && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
            isAutoDismissing ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          style={{
            background: validationResult.success
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          }}
        >
          {/* Efeito de partículas animadas */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${
                  validationResult.success ? "bg-white/30" : "bg-white/20"
                } animate-pulse`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Conteúdo principal */}
          <div className="relative z-10 text-center text-white px-4 sm:px-8 max-w-md mx-auto">
            {/* Ícone animado */}
            <div
              className={`mb-6 sm:mb-8 transition-all duration-700 ${
                isAutoDismissing ? "scale-75 rotate-12" : "scale-100 rotate-0"
              }`}
            >
              {validationResult.success ? (
                <div className="relative">
                  <CheckCircle className="h-24 w-24 sm:h-32 sm:w-32 mx-auto drop-shadow-2xl" />
                  <div className="absolute inset-0 animate-ping">
                    <CheckCircle className="h-24 w-24 sm:h-32 sm:w-32 mx-auto opacity-20" />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <XCircle className="h-24 w-24 sm:h-32 sm:w-32 mx-auto drop-shadow-2xl" />
                  <div className="absolute inset-0 animate-pulse">
                    <XCircle className="h-24 w-24 sm:h-32 sm:w-32 mx-auto opacity-30" />
                  </div>
                </div>
              )}
            </div>

            {/* Título */}
            <h1
              className={`text-4xl sm:text-6xl font-bold mb-4 transition-all duration-500 ${
                isAutoDismissing
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              {validationResult.success ? "VÁLIDO" : "INVÁLIDO"}
            </h1>

            {/* Mensagem */}
            <p
              className={`text-lg sm:text-xl mb-6 sm:mb-8 transition-all duration-700 delay-200 ${
                isAutoDismissing
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              {validationResult.message}
            </p>

            {/* Informações do ticket (se válido) */}
            {validationResult.success && validationResult.data?.ticket && (
              <div
                className={`bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-700 delay-300 ${
                  isAutoDismissing
                    ? "translate-y-4 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-xs sm:text-sm opacity-80">Ticket</p>
                    <p className="text-lg sm:text-2xl font-bold">
                      {validationResult.data.ticket.ticketNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm opacity-80">
                      Participante
                    </p>
                    <p className="text-base sm:text-lg font-semibold">
                      {validationResult.data.ticket.participant.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botão para escanear novamente */}
            <div
              className={`transition-all duration-700 delay-500 ${
                isAutoDismissing
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              <Button
                onClick={() => {
                  setShowFullscreenResult(false);
                  setValidationResult(null);
                  setLastScannedCode("");
                  setScanAttempts(0);
                  startScanning();
                }}
                variant="secondary"
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Camera className="h-4 w-4 mr-2" />
                Escanear Novamente
              </Button>
            </div>

            {/* Contador regressivo */}
            <div
              className={`text-xs sm:text-sm opacity-60 transition-all duration-700 delay-700 ${
                isAutoDismissing
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-center">
                  Ou aguarde para voltar automaticamente...
                </span>
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className={`h-full transition-all duration-3000 ease-linear ${
                validationResult.success ? "bg-white" : "bg-white/80"
              }`}
              style={{
                width: isAutoDismissing ? "100%" : "0%",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
