"use client";

import React from "react";
import { useHybridAuth } from "@/hooks/use-hybrid-auth";
import { RoleBasedRender } from "@/components/auth/role-guard";
import { UserRole } from "@/lib/domain/entities/user.entity";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Ticket, Users, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useHybridAuth();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Gerencie seus eventos e tickets de forma eficiente.
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {user?.role === "ADMIN" && "Administrador"}
            {user?.role === "SORTEADOR" && "Sorteador"}
            {user?.role === "USER" && "Usuário"}
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RoleBasedRender roles={[UserRole.ADMIN, UserRole.SORTEADOR]}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Gerenciar Eventos
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Eventos ativos</p>
              <Button asChild size="sm" className="mt-2">
                <Link href="/painel/events">Ver Eventos</Link>
              </Button>
            </CardContent>
          </Card>
        </RoleBasedRender>

        <RoleBasedRender roles={[UserRole.ADMIN, UserRole.SORTEADOR]}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Gerar Tickets
              </CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Tickets gerados hoje
              </p>
              <Button asChild size="sm" className="mt-2">
                <Link href="/painel/tickets">Gerar Tickets</Link>
              </Button>
            </CardContent>
          </Card>
        </RoleBasedRender>

        <RoleBasedRender roles={[UserRole.ADMIN, UserRole.SORTEADOR]}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Participantes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Total de participantes
              </p>
              <Button asChild size="sm" className="mt-2">
                <Link href="/painel/participants">Ver Participantes</Link>
              </Button>
            </CardContent>
          </Card>
        </RoleBasedRender>

        <RoleBasedRender roles={[UserRole.ADMIN]}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Administração
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Configurações do sistema
              </p>
              <Button asChild size="sm" className="mt-2">
                <Link href="/painel/admin">Configurações</Link>
              </Button>
            </CardContent>
          </Card>
        </RoleBasedRender>
      </div>

      {/* User-specific content */}
      <RoleBasedRender roles={[UserRole.USER]}>
        <Card>
          <CardHeader>
            <CardTitle>Meus Tickets</CardTitle>
            <CardDescription>
              Visualize e gerencie seus tickets de eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Você ainda não possui tickets. Participe de eventos para gerar
                seus tickets!
              </p>
            </div>
          </CardContent>
        </Card>
      </RoleBasedRender>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Últimas ações realizadas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhuma atividade recente encontrada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
