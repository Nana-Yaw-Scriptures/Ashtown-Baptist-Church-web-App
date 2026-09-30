import { requireAdminPage } from "@/lib/authz";
import { FundForm } from "@/components/admin/FundForm";
import { EditLink } from "@/components/admin/EditLink";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteFund } from "@/actions/funds";
import type { Fund } from "@/lib/types";

export default async function AdminFunds() {
  const supabase = await requireAdminPage();
  const { data } = await supabase
    .from("funds")
    .select("*")
    .order("created_at", { ascending: true });
  const funds = (data as Fund[] | null) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Giving funds</h1>
        <p className="mt-2 text-ink/70">The categories people can give toward.</p>
      </div>

      <FundForm />

      <div className="rounded-xl2 border border-mist bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dusk-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Fund</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {funds.map((f) => (
              <tr key={f.id} className="border-t border-mist hover:bg-dusk-50/60 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium">{f.name}</p>
                  {f.description && <p className="text-ink/60">{f.description}</p>}
                </td>
                <td className="px-4 py-3">
                  <span className={f.is_active ? "text-sage" : "text-ink/40"}>
                    {f.is_active ? "Active" : "Off"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <EditLink href={`/admin/funds/${f.id}/edit`} label={`Edit ${f.name}`} />
                    <DeleteButton action={deleteFund.bind(null, f.id)} confirmText={`Delete "${f.name}"?`} />
                  </div>
                </td>
              </tr>
            ))}
            {funds.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-ink/50">No funds yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
