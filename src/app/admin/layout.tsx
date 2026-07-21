import { requireAdmin } from "@/lib/getServerUser";
import { AdminShell } from "@/components/admin/AdminShell";
import { ThemeProvider } from "@/components/admin/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Deep verification (signature + expiry) beyond middleware's cookie
  // presence check. Redirects to /login on missing/invalid/expired token.
  await requireAdmin();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AdminShell>{children}</AdminShell>
      <Toaster />
    </ThemeProvider>
  );
}
