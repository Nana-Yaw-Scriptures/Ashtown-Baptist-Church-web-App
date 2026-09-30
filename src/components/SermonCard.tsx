import Link from "next/link";
import type { Sermon } from "@/lib/types";
import { formatDate, formatDuration } from "@/lib/utils";

export function SermonCard({ sermon }: { sermon: Sermon }) {
  return (
    <Link
      href={`/sermons/${sermon.id}`}
      className="group block rounded-xl2 border border-mist bg-white overflow-hidden hover:border-dusk-500 transition-colors"
    >
      <div className="aspect-[16/9] bg-dusk-50 relative">
        {sermon.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sermon.thumbnail_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-dusk-500/40">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs text-ink">
          {sermon.media_type === "video" ? "Watch" : "Listen"}
        </span>
      </div>
      <div className="p-5">
        {sermon.series && (
          <p className="text-xs text-sage mb-1">{sermon.series}</p>
        )}
        <h3 className="font-display text-lg leading-snug group-hover:text-dusk-600">
          {sermon.title}
        </h3>
        <p className="mt-2 text-sm text-ink/70">
          {sermon.speaker} · {formatDate(sermon.preached_on)}
          {sermon.duration_seconds
            ? ` · ${formatDuration(sermon.duration_seconds)}`
            : ""}
        </p>
      </div>
    </Link>
  );
}
