import Link from "next/link";
import type { ChurchEvent } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function EventCard({ event }: { event: ChurchEvent }) {
  const start = new Date(event.starts_at);
  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex gap-4 rounded-xl2 border border-mist bg-white p-5 hover:border-dusk-500 transition-colors"
    >
      {/* Date chip */}
      <div className="shrink-0 w-16 text-center">
        <div className="rounded-lg border border-mist overflow-hidden">
          <div className="bg-dusk-600 text-paper text-xs py-1">
            {start.toLocaleString("en-CA", { month: "short" })}
          </div>
          <div className="py-2 font-display text-2xl">{start.getDate()}</div>
        </div>
      </div>
      <div className="min-w-0">
        {event.category && (
          <p className="text-xs text-sage mb-0.5">{event.category}</p>
        )}
        <h3 className="font-display text-lg leading-snug group-hover:text-dusk-600 truncate">
          {event.title}
        </h3>
        <p className="mt-1 text-sm text-ink/70">{formatDateTime(event.starts_at)}</p>
        {event.location && (
          <p className="mt-0.5 text-sm text-ink/60">{event.location}</p>
        )}
      </div>
    </Link>
  );
}
