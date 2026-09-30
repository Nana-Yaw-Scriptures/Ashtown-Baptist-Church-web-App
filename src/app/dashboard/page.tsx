import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui";
import { formatDateTime, formatDate, formatMoney } from "@/lib/utils";

export const metadata = { title: "My space · Asht-Town Baptist Church" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Upcoming events the user is registered for.
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("event:events(*)")
    .eq("user_id", user.id);
  const myEvents = (registrations ?? [])
    .map((r: any) => r.event)
    .filter(Boolean)
    .filter((e: any) => new Date(e.starts_at) >= new Date())
    .sort(
      (a: any, b: any) =>
        new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
    );

  const { data: myPrayers } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: myGifts } = await supabase
    .from("donations")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "succeeded")
    .order("created_at", { ascending: false });

  const totalGiving = (myGifts ?? []).reduce(
    (sum: number, g: any) => sum + g.amount_cents,
    0
  );

  const firstName = (profile?.full_name || "friend").split(" ")[0];

  return (
    <Container className="py-16">
      <p className="text-sage mb-2">Your space</p>
      <h1 className="font-display text-4xl leading-tight">Hello, {firstName}.</h1>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {/* Upcoming events */}
        <section className="lg:col-span-2 rounded-xl2 border border-mist bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Events you're attending</h2>
            <Link href="/events" className="text-sm text-dusk-600 hover:underline">
              Browse events
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {myEvents.length === 0 ? (
              <p className="text-ink/60 text-sm">
                You are not registered for any upcoming events.
              </p>
            ) : (
              myEvents.map((e: any) => (
                <Link
                  key={e.id}
                  href={`/events/${e.id}`}
                  className="block rounded-lg border border-mist p-4 hover:border-dusk-500"
                >
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm text-ink/60">{formatDateTime(e.starts_at)}</p>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Giving summary */}
        <section className="rounded-xl2 bg-dusk-600 text-paper p-6">
          <h2 className="font-display text-xl">Your giving</h2>
          <p className="mt-4 text-3xl font-display">{formatMoney(totalGiving)}</p>
          <p className="text-paper/70 text-sm">donaten so far</p>
          <Link
            href="/donate"
            className="mt-6 inline-flex rounded-full bg-amber-400 text-white px-4 py-2 text-sm hover:bg-amber-500"
          >
            Donate again
          </Link>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* My prayer requests */}
        <section className="rounded-xl2 border border-mist bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Your prayer requests</h2>
            <Link href="/prayer" className="text-sm text-dusk-600 hover:underline">
              Prayer wall
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {(!myPrayers || myPrayers.length === 0) ? (
              <p className="text-ink/60 text-sm">You have not posted any requests.</p>
            ) : (
              myPrayers.map((p: any) => (
                <div key={p.id} className="rounded-lg border border-mist p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{p.title}</p>
                    <span className="text-xs text-sage capitalize">{p.status}</span>
                  </div>
                  <p className="text-sm text-ink/60 mt-1 line-clamp-2">{p.body}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent gifts */}
        <section className="rounded-xl2 border border-mist bg-white p-6">
          <h2 className="font-display text-xl">Recent gifts</h2>
          <div className="mt-4 space-y-2">
            {(!myGifts || myGifts.length === 0) ? (
              <p className="text-ink/60 text-sm">No gifts recorded yet.</p>
            ) : (
              myGifts.slice(0, 6).map((g: any) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between border-b border-mist last:border-0 py-2 text-sm"
                >
                  <span className="text-ink/70">{formatDate(g.created_at)}</span>
                  <span className="font-medium">{formatMoney(g.amount_cents)}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </Container>
  );
}
