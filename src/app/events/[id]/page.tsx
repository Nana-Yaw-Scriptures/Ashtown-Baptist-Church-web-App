import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container, Badge } from "@/components/ui";
import { RegisterButton } from "@/components/RegisterButton";
import { formatDateTime } from "@/lib/utils";
import type { ChurchEvent } from "@/lib/types";

export const revalidate = 60;

export default async function EventDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("events").select("*").eq("id", id).single();
  const event = data as ChurchEvent | null;
  if (!event) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let registered = false;
  let attendeeCount = 0;

  const { count } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id);
  attendeeCount = count ?? 0;

  if (user) {
    const { data: reg } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("event_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    registered = !!reg;
  }

  return (
    <Container className="py-12 max-w-3xl">
      <Link href="/events" className="text-sm text-dusk-600 hover:underline">
        ← All events
      </Link>

      {event.category && (
        <div className="mt-6">
          <Badge>{event.category}</Badge>
        </div>
      )}

      <h1 className="mt-4 font-display text-3xl sm:text-4xl leading-tight">
        {event.title}
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl2 border border-mist p-4">
          <p className="text-xs text-sage">When</p>
          <p className="mt-1 font-medium">{formatDateTime(event.starts_at)}</p>
          {event.ends_at && (
            <p className="text-sm text-ink/60">
              until {formatDateTime(event.ends_at)}
            </p>
          )}
        </div>
        <div className="rounded-xl2 border border-mist p-4">
          <p className="text-xs text-sage">Where</p>
          <p className="mt-1 font-medium">{event.location ?? "To be announced"}</p>
          {event.capacity && (
            <p className="text-sm text-ink/60">
              {attendeeCount} of {event.capacity} registered
            </p>
          )}
        </div>
      </div>

      {event.description && (
        <div className="prose-body mt-8 text-ink/80">
          <p>{event.description}</p>
        </div>
      )}

      <div className="mt-8">
        <RegisterButton
          eventId={event.id}
          signedIn={!!user}
          initiallyRegistered={registered}
        />
      </div>
    </Container>
  );
}
