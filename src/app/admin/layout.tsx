import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/admin";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const admin = await getAdminUser(supabase);

  // proxy.ts already gates /admin, but every admin page defends itself too
  // rather than trusting middleware alone.
  if (!admin) redirect("/");

  return (
    <div className="min-h-screen notebook-bg">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
