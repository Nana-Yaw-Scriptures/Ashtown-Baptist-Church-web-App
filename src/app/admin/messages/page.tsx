import { requireAdminPage } from "@/lib/authz";
import { MessageControls } from "@/components/admin/MessageControls";
import { formatDateTime } from "@/lib/utils";
import type { ContactMessage } from "@/lib/types";

export default async function AdminMessages() {
  const supabase = await requireAdminPage();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  const messages = (data as ContactMessage[] | null) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Messages</h1>
        <p className="mt-2 text-ink/70">Messages sent through the contact form.</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-ink/60">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="rounded-xl2 border border-mist bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {m.subject || "(no subject)"}
                    {m.handled && (
                      <span className="ml-2 rounded-full bg-dusk-50 text-dusk-700 px-2 py-0.5 text-xs">Handled</span>
                    )}
                  </p>
                  <p className="text-xs text-sage mt-0.5">
                    {m.name} · {m.email} · {formatDateTime(m.created_at)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-ink/80 leading-relaxed whitespace-pre-wrap">{m.body}</p>
              <div className="mt-4">
                <MessageControls id={m.id} handled={m.handled} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
