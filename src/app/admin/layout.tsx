import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const role = profile?.role;
  const isStaff = role === "admin" || role === "media";

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-[#F3F5FA] flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-display text-3xl text-ink">Staff only</h1>
          <p className="mt-3 text-ink/70 max-w-sm">
            This area is for church staff. If you should have access, ask an administrator to update your role.
          </p>
          <Link href="/" className="mt-6 inline-block text-dusk-600 hover:underline">Back to the site</Link>
        </div>
      </div>
    );
  }

  const firstName = (profile?.full_name || "").split(" ")[0];

  return (
    <AdminShell role={role as "admin" | "media"} name={firstName}>
      {children}
    </AdminShell>
  );
}
