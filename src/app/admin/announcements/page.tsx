import { requireAdminPage } from "@/lib/authz";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { AnnouncementControls } from "@/components/admin/AnnouncementControls";
import { formatDate } from "@/lib/utils";
import type { Announcement } from "@/lib/types";

export default async function AdminAnnouncements() {
  const supabase = await requireAdminPage();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  const items = (data as Announcement[] | null) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Announcements</h1>
        <p className="mt-2 text-ink/70">Show a notice bar across the top of the site.</p>
      </div>

      <AnnouncementForm />

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-ink/60">No announcements yet.</p>
        ) : (
          items.map((a) => (
            <div key={a.id} className="rounded-xl2 border border-mist bg-white p-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-ink">{a.message}</p>
                <p className="mt-1 text-xs text-sage">
                  {a.active ? "Showing now" : "Off"} · {formatDate(a.created_at)}
                </p>
              </div>
              <AnnouncementControls id={a.id} active={a.active} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
