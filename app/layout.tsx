import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebarProvider } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { SidebarInset } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventTicket - Sistema de Geração e Validação de Tickets",
  description:
    "Sistema completo para geração e validação de tickets com QR codes únicos para eventos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppSidebarProvider>
          {/* <AppTopbar /> */}
          <SidebarInset>
            <main className="flex-1 p-6">{children}</main>
          </SidebarInset>
        </AppSidebarProvider>
      </body>
    </html>
  );
}
