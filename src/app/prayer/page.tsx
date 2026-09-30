import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui";
import { PrayerCard } from "@/components/PrayerCard";
import { PrayerSubmitForm } from "@/components/PrayerSubmitForm";
import type { PrayerRequest } from "@/lib/types";

export const metadata = { title: "Prayer wall · Ashtown Baptist Church" };

export default async function PrayerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public prayers + the user's own, newest first, with pray counts.
  const { data } = await supabase
    .from("prayer_requests_with_counts")
    .select("*")
    .neq("status", "archived")
    .order("created_at", { ascending: false });

  const requests = (data as PrayerRequest[] | null) ?? [];

  // Names of authors (for non-anonymous posts).
  const authorIds = Array.from(new Set(requests.map((r) => r.user_id)));
  const { data: profiles } = await supabase
    .from("author_directory")
    .select("id, full_name")
    .in("id", authorIds.length ? authorIds : ["00000000-0000-0000-0000-000000000000"]);
  const nameById = new Map(
    (profiles ?? []).map((p: any) => [p.id, p.full_name || "A member"])
  );

  // Which ones has the current user prayed for?
  let prayedIds = new Set<string>();
  if (user) {
    const { data: interactions } = await supabase
      .from("prayer_interactions")
      .select("prayer_request_id")
      .eq("user_id", user.id);
    prayedIds = new Set(
      (interactions ?? []).map((i: any) => i.prayer_request_id)
    );
  }

  return (
    <Container className="py-16 max-w-3xl">
      <div>
        <p className="text-sage mb-3">Carry one another</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight">
          Prayer wall
        </h1>
        <p className="mt-4 text-ink/75 leading-relaxed">
          Share what is on your heart and let the community pray with you. Tap
          "I prayed" to let someone know they are being held.
        </p>
      </div>

      <div className="mt-8">
        <PrayerSubmitForm />
      </div>

      <div className="mt-10 space-y-5">
        {requests.length === 0 ? (
          <p className="text-ink/60">
            No requests yet. Be the first to share one.
          </p>
        ) : (
          requests.map((r) => (
            <PrayerCard
              key={r.id}
              request={r}
              authorName={nameById.get(r.user_id) || "A member"}
              hasPrayed={prayedIds.has(r.id)}
            />
          ))
        )}
      </div>
    </Container>
  );
}
