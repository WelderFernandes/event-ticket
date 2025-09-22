import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/common/header";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute redirectTo="/auth/login">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
