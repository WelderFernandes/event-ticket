"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { UserProfile } from "../auth/user-profile";

export function Header() {
  return (
    // <header className="flex h-16 bg-accent-foreground shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
    //   <div className="flex items-center gap-2 px-4 flex-1">
    //     <SidebarTrigger className="-ml-1" />
    //     <Separator
    //       orientation="vertical"
    //       className="mr-2 data-[orientation=vertical]:h-4"
    //     />
    //     <Breadcrumb>
    //       <BreadcrumbList>
    //         <BreadcrumbItem className="hidden md:block">
    //           <BreadcrumbLink href="/painel">Event Ticket</BreadcrumbLink>
    //         </BreadcrumbItem>
    //         <BreadcrumbSeparator className="hidden md:block" />
    //         <BreadcrumbItem>
    //           <BreadcrumbPage>Dashboard</BreadcrumbPage>
    //         </BreadcrumbItem>
    //       </BreadcrumbList>
    //     </Breadcrumb>
    //   </div>
    //   <div className="flex items-center gap-2 px-4">
    //     <UserProfile />
    //   </div>
    // </header>
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r">
      <div className="mx-6 flex h-14 items-center">
        <div className="mr-4 flex">
          <div className="mr-6 flex items-center space-x-2">
            <SidebarTrigger />
          </div>
        </div>
      </div>
    </header>
  );
}
