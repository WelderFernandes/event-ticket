"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar1,
  Command,
  Frame,
  GalleryVerticalEnd,
  LucideIcon,
  Map,
  PieChart,
  RssIcon,
  Settings2,
  SquareTerminal,
  Ticket,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

export interface NavUser {
  name: string;
  email: string;
  avatar: string;
}

export interface NavTeam {
  name: string;
  logo: React.ElementType;
  plan: string;
}

export interface NavMain {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url?: string;
  }[];
}

export interface NavProjects {
  name: string;
  url?: string;
  icon: LucideIcon;
}

export interface MenuItems {
  user?: NavUser;
  teams?: NavTeam[];
  navMain?: NavMain[];
  projects?: NavProjects[];
}

// This is sample data.
const menuItems: MenuItems = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Eventos",
      url: "/dashboard/events",
      icon: Calendar1,
    },
    {
      title: "Tickets",
      url: "/dashboard/tickets",
      icon: Ticket,
    },
    {
      title: "Sorteios",
      icon: Bot,
      url: "/dashboard/raffle",
    },
    {
      title: "Usuários",
      url: "/dashboard/users",
      icon: BookOpen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Função para calcular se um item está ativo baseado na URL atual
  const isItemActive = (itemUrl?: string): boolean => {
    if (!itemUrl) return false;
    return pathname === itemUrl;
  };

  // Adiciona a propriedade isActive dinamicamente aos itens do menu
  const navMainWithActiveState =
    menuItems.navMain?.map((item) => ({
      ...item,
      isActive: isItemActive(item.url),
    })) || [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={menuItems.teams || []} /> */}
        <div className="fle-1 flex justify-center align-middle">
          <div className="relative h-12 w-40">
            <Image
              src={"/img/logo_site.png"}
              fill
              alt="Logo - Prefeitura Municipal de Cariacica"
              className="object-contain"
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActiveState} />
        {/* {menuItems.projects && (
          <NavProjects projects={menuItems.projects || []} />
        )} */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={menuItems.user || { name: "", email: "", avatar: "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
