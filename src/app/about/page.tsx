import { createClient } from "@/lib/supabase/server";
import { Container, SectionHeading, ButtonLink } from "@/components/ui";
import { ChurchMap } from "@/components/ChurchMap";

export const metadata = { title: "About · Ashtown Baptist Church" };

const beliefs = [
  {
    title: "Grace before effort",
    body: "We are welcomed by God because of what he has done, not because of what we manage to achieve. That order changes everything.",
  },
  {
    title: "An open table",
    body: "The welcome of God has room for people the world overlooks. We try to keep our doors as wide as his.",
  },
  {
    title: "The quiet work of faith",
    body: "Most of the life of faith is built in ordinary, unseen moments — in service, honesty, and steady love.",
  },
];

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("hero_image_url, feature_image_url, feature_caption")
    .eq("id", "main")
    .maybeSingle();
  const heroUrl = settings?.hero_image_url ?? null;
  const flyerUrl = settings?.feature_image_url ?? null;
  const flyerCaption = settings?.feature_caption ?? null;

  const { data: featuredImg } = await supabase
    .from("events")
    .select("id, title, image_url, starts_at")
    .eq("published", true)
    .not("image_url", "is", null)
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <>
      {heroUrl && (
        <div className="relative h-56 sm:h-72 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroUrl} alt="Ashtown Baptist Church" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dusk-700/55 to-transparent" aria-hidden />
        </div>
      )}
    <Container className="py-16">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] items-center">
        <div className="max-w-2xl">
        <p className="text-amber-500 mb-3">Who we are</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight">
          A Christ community, learning to trust God together.
        </h1>
        <div className="prose-body mt-6 text-ink/80">
          <p>
            Ashtown Baptist Church began with a small group of people who wanted a place
            to be honest about faith and doubt. We are still that, only larger.
            We gather each Sunday to worship, to learn from Scripture, and to
            share communion.
          </p>
          <p>
            You do not need to have anything figured out to belong here. Come as
            you are, sit in the back if you like, and see whether this is a
            place you can grow.
          </p>
        </div>
      </div>

        <div>
          {flyerUrl ? (
            <div className="rounded-xl2 border border-mist bg-white p-3 shadow-[0_1px_2px_rgba(16,33,61,0.06)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={flyerUrl} alt="Featured flyer" className="w-full rounded-lg object-contain max-h-[560px]" />
              {flyerCaption && (
                <p className="mt-3 px-1 pb-1 text-sm text-ink/75 leading-relaxed">{flyerCaption}</p>
              )}
            </div>
          ) : featuredImg ? (
            <a href={`/events/${featuredImg.id}`} className="block group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredImg.image_url as string}
                alt={featuredImg.title as string}
                className="w-full aspect-[4/3] object-cover rounded-xl2 border border-mist shadow-[0_1px_2px_rgba(16,33,61,0.06)]"
              />
              <p className="mt-3 text-sm text-sage">
                Coming up:{" "}
                <span className="text-dusk-600 group-hover:underline">{featuredImg.title as string}</span>
              </p>
            </a>
          ) : (
            <div className="rounded-xl2 border border-mist bg-white p-10 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/atbc-logo-full.png" alt="Ashtown Baptist Church" className="h-40 w-40 rounded-full" />
            </div>
          )}
        </div>
      </div>

      <section className="mt-16">
        <SectionHeading lead="What we hold to" title="What we believe" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {beliefs.map((b) => (
            <div key={b.title} className="rounded-xl2 border border-mist bg-white p-6">
              <h3 className="font-display text-xl">{b.title}</h3>
              <p className="mt-2 text-ink/75 leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-8 md:grid-cols-2 items-center">
        <div>
          <SectionHeading lead="Come by" title="Planning your first visit" />
          <div className="prose-body mt-4 text-ink/80">
            <p>
              Services run about seventy-five minutes. There is coffee before and
              after, and a warm welcome either way. Children are welcome in the
              service, and there is care available for the very young.
            </p>
          </div>
          <ButtonLink href="/events" variant="primary" className="mt-4">
            See service times
          </ButtonLink>
        </div>
        <div className="rounded-xl2 border border-mist bg-dusk-50 p-8">
          <h3 className="font-display text-xl mb-4">Find us</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-sage">Address</dt>
              <dd className="text-ink">Ashtown, Kumasi, Ghana</dd>
            </div>
            <div>
              <dt className="text-sage">Sunday worship</dt>
              <dd className="text-ink">10:00 AM</dd>
            </div>
            <div>
              <dt className="text-sage">Contact</dt>
              <dd className="text-ink">hello@gracechurch.example</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading lead="Come and see" title="Find us on the map" />
        <div className="mt-8">
          <ChurchMap />
        </div>
      </section>
    </Container>
    </>
  );
}
