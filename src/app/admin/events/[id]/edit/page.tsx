import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventForm } from "@/components/admin/EventForm";
import type { ChurchEvent } from "@/lib/types";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  const event = data as ChurchEvent | null;
  if (!event) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/events" className="text-sm text-dusk-600 hover:underline">
          ← Back to events
        </Link>
        <h1 className="mt-2 font-display text-3xl">Edit event</h1>
        <p className="mt-1 text-ink/70">Update the details and save your changes.</p>
      </div>
      <EventForm event={event} />
    </div>
  );
}
