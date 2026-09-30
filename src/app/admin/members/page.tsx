import { requireAdminPage } from "@/lib/authz";
import { RoleToggle } from "@/components/admin/RoleToggle";
import { formatDate } from "@/lib/utils";

export default async function AdminMembers() {
  const supabase = await requireAdminPage();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  const members = data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Roles</h1>
        <p className="mt-2 text-ink/70">
          Who can sign in, and the access level for each person.
        </p>
      </div>

      <div className="rounded-xl2 border border-mist bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dusk-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {members.map((m: any) => (
              <tr key={m.id} className="border-t border-mist hover:bg-dusk-50/60 transition-colors">
                <td className="px-4 py-3">{m.full_name || "—"}</td>
                <td className="px-4 py-3 text-ink/70">{m.email}</td>
                <td className="px-4 py-3 text-ink/70">{formatDate(m.created_at)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      m.role === "admin"
                        ? "bg-dusk-600 text-paper"
                        : "bg-dusk-50 text-dusk-700"
                    }`}
                  >
                    {m.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <RoleToggle userId={m.id} role={m.role} />
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink/50">
                  No members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
