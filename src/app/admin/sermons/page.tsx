import { createClient } from "@/lib/supabase/server";
import { SermonForm } from "@/components/admin/SermonForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { EditLink } from "@/components/admin/EditLink";
import { deleteSermon } from "@/actions/admin";
import { formatDate } from "@/lib/utils";
import type { Sermon } from "@/lib/types";

export default async function AdminSermons() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sermons")
    .select("*")
    .order("preached_on", { ascending: false });
  const sermons = (data as Sermon[] | null) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Sermons</h1>
        <p className="mt-2 text-ink/70">Post new teaching and manage the library.</p>
      </div>

      <SermonForm />

      <div className="rounded-xl2 border border-mist bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dusk-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Speaker</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {sermons.map((s) => (
              <tr key={s.id} className="border-t border-mist hover:bg-dusk-50/60 transition-colors">
                <td className="px-4 py-3">{s.title}</td>
                <td className="px-4 py-3 text-ink/70">{s.speaker}</td>
                <td className="px-4 py-3 text-ink/70">{formatDate(s.preached_on)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <EditLink
                      href={`/admin/sermons/${s.id}/edit`}
                      label={`Edit ${s.title}`}
                    />
                    <DeleteButton
                      action={deleteSermon.bind(null, s.id)}
                      confirmText={`Delete "${s.title}"?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {sermons.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-ink/50">
                  No sermons yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
