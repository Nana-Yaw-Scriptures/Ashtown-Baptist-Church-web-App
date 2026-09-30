import { requireAdminPage } from "@/lib/authz";
import { formatMoney, formatDate } from "@/lib/utils";

export default async function AdminDonations() {
  const supabase = await requireAdminPage();

  const { data: donations } = await supabase
    .from("donations")
    .select("*, fund:funds(name)")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = donations ?? [];
  const total = rows
    .filter((d: any) => d.status === "succeeded")
    .reduce((s: number, d: any) => s + d.amount_cents, 0);

  const statusStyle: Record<string, string> = {
    succeeded: "text-sage",
    pending: "text-amber-500",
    failed: "text-red-600",
    refunded: "text-ink/50",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Giving</h1>
        <p className="mt-2 text-ink/70">
          Every gift recorded through the site. Totals count completed gifts only.
        </p>
      </div>

      <div className="rounded-xl2 bg-dusk-600 text-paper p-6 max-w-xs">
        <p className="text-sm text-paper/70">Total received</p>
        <p className="mt-1 font-display text-4xl">{formatMoney(total)}</p>
      </div>

      <div className="rounded-xl2 border border-mist bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dusk-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Donor</th>
              <th className="px-4 py-3 font-medium">Fund</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d: any) => (
              <tr key={d.id} className="border-t border-mist hover:bg-dusk-50/60 transition-colors">
                <td className="px-4 py-3 text-ink/70">{formatDate(d.created_at)}</td>
                <td className="px-4 py-3">{d.donor_email || "Anonymous"}</td>
                <td className="px-4 py-3 text-ink/70">{d.fund?.name || "—"}</td>
                <td className="px-4 py-3 font-medium">{formatMoney(d.amount_cents)}</td>
                <td className={`px-4 py-3 capitalize ${statusStyle[d.status] || ""}`}>
                  {d.status}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink/50">
                  No gifts recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
