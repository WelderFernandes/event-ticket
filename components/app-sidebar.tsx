"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  LucideIcon,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
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
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Eventos",
      url: "/dashboard/events",
      icon: SquareTerminal,
      isActive: true,
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
    // {
    //   title: "Relatórios",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "Relatório de Eventos",
    //       url: "#",
    //     },
    //     {
    //       title: "Relatório de Participantes",
    //       url: "#",
    //     },
    //     {
    //       title: "Relatório de Tickets",
    //       url: "#",
    //     },
    //     {
    //       title: "Relatório de Validação",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={menuItems.teams || []} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems.navMain || []} />
        {menuItems.projects && (
          <NavProjects projects={menuItems.projects || []} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={menuItems.user || { name: "", email: "", avatar: "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
