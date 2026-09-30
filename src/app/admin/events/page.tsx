import { createClient } from "@/lib/supabase/server";
import { EventForm } from "@/components/admin/EventForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { EditLink } from "@/components/admin/EditLink";
import { deleteEvent } from "@/actions/admin";
import { formatDateTime } from "@/lib/utils";
import type { ChurchEvent } from "@/lib/types";

export default async function AdminEvents() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: false });
  const events = (data as ChurchEvent[] | null) ?? [];

  // Registration counts per event.
  const { data: regs } = await supabase
    .from("event_registrations")
    .select("event_id");
  const counts = new Map<string, number>();
  (regs ?? []).forEach((r: any) => {
    counts.set(r.event_id, (counts.get(r.event_id) ?? 0) + 1);
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Events</h1>
        <p className="mt-2 text-ink/70">Schedule gatherings and track sign-ups.</p>
      </div>

      <EventForm />

      <div className="rounded-xl2 border border-mist bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dusk-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Registered</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-t border-mist hover:bg-dusk-50/60 transition-colors">
                <td className="px-4 py-3">{e.title}</td>
                <td className="px-4 py-3 text-ink/70">{formatDateTime(e.starts_at)}</td>
                <td className="px-4 py-3 text-ink/70">
                  {counts.get(e.id) ?? 0}
                  {e.capacity ? ` / ${e.capacity}` : ""}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <EditLink
                      href={`/admin/events/${e.id}/edit`}
                      label={`Edit ${e.title}`}
                    />
                    <DeleteButton
                      action={deleteEvent.bind(null, e.id)}
                      confirmText={`Delete "${e.title}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink/50">
                  No events yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
