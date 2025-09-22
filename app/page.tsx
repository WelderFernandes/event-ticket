"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHybridAuth } from "@/hooks/use-hybrid-auth";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Ticket,
  QrCode,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function Home() {
  const { isAuthenticated, isLoading } = useHybridAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log("isAuthenticated", isAuthenticated);
      // #TODO: Remover este console.log
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Será redirecionado pelo useEffect
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Sistema de Tickets para Eventos
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Gere tickets únicos com QR codes, gerencie participantes e valide
          entradas de forma segura e eficiente para seus eventos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/auth/login">
              <Ticket className="mr-2 h-5 w-5" />
              Fazer Login
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/register">
              <QrCode className="mr-2 h-5 w-5" />
              Criar Conta
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-blue-600" />
              Geração de Tickets
            </CardTitle>
            <CardDescription>
              Crie tickets únicos com QR codes para cada participante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                QR codes únicos e seguros
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Controle de limite de participantes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Download automático do QR code
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-green-600" />
              Validação Inteligente
            </CardTitle>
            <CardDescription>
              Valide tickets em tempo real com scanner de QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Scanner com câmera
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Validação manual
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Uso único garantido
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Gestão de Participantes
            </CardTitle>
            <CardDescription>
              Organize e gerencie participantes dos seus eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Cadastro completo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Histórico de participação
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Controle de duplicatas
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesse as funcionalidades principais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/auth/login">
                  <Calendar className="mr-2 h-4 w-4" />
                  Gerenciar Eventos
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/auth/login">
                  <Ticket className="mr-2 h-4 w-4" />
                  Gerar Tickets
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/validation">
                  <QrCode className="mr-2 h-4 w-4" />
                  Validar Tickets
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/auth/login">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Relatórios
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estatísticas Rápidas
            </CardTitle>
            <CardDescription>Visão geral do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">-</div>
                <div className="text-sm text-blue-600">Eventos Ativos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">-</div>
                <div className="text-sm text-green-600">Tickets Gerados</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">-</div>
                <div className="text-sm text-purple-600">Participantes</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">-</div>
                <div className="text-sm text-orange-600">Validações</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Sistema Operacional</span>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <Clock className="mr-1 h-3 w-3" />
              Online
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
