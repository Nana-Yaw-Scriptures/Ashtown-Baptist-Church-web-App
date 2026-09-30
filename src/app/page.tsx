import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container, ButtonLink, SectionHeading } from "@/components/ui";
import { SermonCard } from "@/components/SermonCard";
import { EventCard } from "@/components/EventCard";
import type { Sermon, ChurchEvent } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: sermons } = await supabase
    .from("sermons")
    .select("*")
    .eq("published", true)
    .order("preached_on", { ascending: false })
    .limit(3);

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(3);

  const { data: settings } = await supabase
    .from("site_settings")
    .select("hero_image_url")
    .eq("id", "main")
    .maybeSingle();
  const heroUrl = settings?.hero_image_url ?? null;

  return (
    <>
      {/* Hero — a navy block, an invitation to gather */}
      <section className="relative overflow-hidden text-white">
        {heroUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-dusk-700/55 to-transparent" aria-hidden />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-dusk-600 to-dusk-700" aria-hidden />
        )}
        <Container className="relative py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="text-white/80 mb-4 [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">THE MODEL CHURCH</p>
            <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
              Ashtown Baptist
              <span className="italic"> Church.</span>
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-xl leading-relaxed [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
              We are a Christ community learning to trust God together. There
              is a place for you here, whether you have been walking with faith
              for years or are only beginning to wonder about it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/about" variant="amber">
                Plan a visit
              </ButtonLink>
              <Link
                href="/sermons"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Listen to a sermon
              </Link>
            </div>

            <div className="mt-12 inline-flex items-center gap-6 rounded-xl2 bg-white text-ink px-6 py-4">
              <div>
                <p className="text-xs text-sage">We gather</p>
                <p className="font-display text-xl">Sundays, 10:00 AM</p>
              </div>
              <div className="h-10 w-px bg-mist" />
              <div>
                <p className="text-xs text-sage">Find us</p>
                <p className="font-display text-xl">Ashtown, Kumasi</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Latest sermons */}
      <Container className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading lead="Recent teaching" title="Latest sermons" />
          <Link href="/sermons" className="text-sm text-dusk-600 hover:underline shrink-0">
            All sermons
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(sermons as Sermon[] | null)?.map((s) => (
            <SermonCard key={s.id} sermon={s} />
          ))}
          {(!sermons || sermons.length === 0) && (
            <p className="text-ink/60">Sermons will appear here once they are posted.</p>
          )}
        </div>
      </Container>

      {/* Upcoming events */}
      <Container className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading lead="Come along" title="What's coming up" />
          <Link href="/events" className="text-sm text-dusk-600 hover:underline shrink-0">
            Full calendar
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(events as ChurchEvent[] | null)?.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
          {(!events || events.length === 0) && (
            <p className="text-ink/60">No events scheduled yet. Check back soon.</p>
          )}
        </div>
      </Container>

      {/* Giving + prayer split */}
      <Container className="mt-24">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl2 bg-dusk-600 text-paper p-8">
            <h3 className="font-display text-2xl">Donate toward the work</h3>
            <p className="mt-3 text-paper/80 leading-relaxed">
              Your generosity keeps the lights on, feeds our neighbors, and
              supports mission near and far. Every gift matters.
            </p>
            <ButtonLink href="/donate" variant="amber" className="mt-6">
              Donate now
            </ButtonLink>
          </div>
          <div className="rounded-xl2 border border-mist bg-white p-8">
            <h3 className="font-display text-2xl">Ask for prayer</h3>
            <p className="mt-3 text-ink/75 leading-relaxed">
              Share what is on your heart and let the community carry it with
              you. You can post openly or keep it private to the staff.
            </p>
            <ButtonLink href="/prayer" variant="ghost" className="mt-6">
              Go to the prayer wall
            </ButtonLink>
          </div>
        </div>
      </Container>
    </>
  );
}
