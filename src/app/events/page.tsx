import { createClient } from "@/lib/supabase/server";
import { Container, SectionHeading } from "@/components/ui";
import { EventCard } from "@/components/EventCard";
import { EventCalendar } from "@/components/EventCalendar";
import type { ChurchEvent } from "@/lib/types";

export const metadata = { title: "Events · Ashtown Baptist Church" };
export const revalidate = 60;

export default async function EventsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("published", true)
    .order("starts_at", { ascending: true });

  const events = (data as ChurchEvent[] | null) ?? [];
  const upcoming = events.filter((e) => new Date(e.starts_at) >= new Date());

  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <p className="text-sage mb-3">Gather</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight">Events</h1>
        <p className="mt-4 text-ink/75 leading-relaxed">
          Sunday worship, midweek prayer, and the many smaller ways we share
          life. Browse the calendar or scan what is coming up.
        </p>
      </div>

      <section className="mt-12">
        <EventCalendar events={events} />
      </section>

      <section className="mt-16">
        <SectionHeading lead="Next few weeks" title="Coming up" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {upcoming.length === 0 ? (
            <p className="text-ink/60">No upcoming events scheduled.</p>
          ) : (
            upcoming.map((e) => <EventCard key={e.id} event={e} />)
          )}
        </div>
      </section>
    </Container>
  );
}
