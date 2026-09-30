import { requireAdminPage } from "@/lib/authz";
import { PrayerControls } from "@/components/admin/PrayerControls";
import { formatDate } from "@/lib/utils";

export default async function AdminPrayer() {
  const supabase = await requireAdminPage();

  // Admins can see all requests (including private) via RLS.
  const { data } = await supabase
    .from("prayer_requests")
    .select("*")
    .order("created_at", { ascending: false });
  const requests = data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Prayer requests</h1>
        <p className="mt-2 text-ink/70">
          Care for what people have shared. Mark requests answered, archive old
          ones, or remove anything inappropriate.
        </p>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-ink/60">No requests yet.</p>
        ) : (
          requests.map((r: any) => (
            <div key={r.id} className="rounded-xl2 border border-mist bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg">{r.title}</h3>
                    <span className="text-xs text-sage capitalize">· {r.status}</span>
                    {!r.is_public && (
                      <span className="rounded-full bg-mist px-2 py-0.5 text-xs">
                        Staff only
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-sage mt-0.5">
                    {r.is_anonymous ? "Anonymous" : "Member"} · {formatDate(r.created_at)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-ink/80 leading-relaxed whitespace-pre-wrap">
                {r.body}
              </p>
              <div className="mt-4">
                <PrayerControls id={r.id} status={r.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
