import { requireAdmin } from "@/app/admin/_lib/requireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { ThemeProvider } from "@/components/admin/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AdminShell>{children}</AdminShell>
      <Toaster />
    </ThemeProvider>
  );
}
