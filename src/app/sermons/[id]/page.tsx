import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container, Badge } from "@/components/ui";
import { formatDate, formatDuration, toVideoEmbed } from "@/lib/utils";
import type { Sermon } from "@/lib/types";

export const revalidate = 60;

export default async function SermonDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .single();

  const sermon = data as Sermon | null;
  if (!sermon) notFound();

  const embed =
    sermon.media_type === "video" ? toVideoEmbed(sermon.media_url) : null;

  return (
    <Container className="py-12 max-w-3xl">
      <Link href="/sermons" className="text-sm text-dusk-600 hover:underline">
        ← All sermons
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {sermon.series && <Badge>{sermon.series}</Badge>}
        <Badge>{sermon.media_type === "video" ? "Video" : "Audio"}</Badge>
      </div>

      <h1 className="mt-4 font-display text-3xl sm:text-4xl leading-tight">
        {sermon.title}
      </h1>
      <p className="mt-3 text-ink/70">
        {sermon.speaker} · {formatDate(sermon.preached_on)}
        {sermon.duration_seconds ? ` · ${formatDuration(sermon.duration_seconds)}` : ""}
      </p>
      {sermon.scripture && (
        <p className="mt-1 text-sage">{sermon.scripture}</p>
      )}

      {/* Media */}
      <div className="mt-8">
        {embed ? (
          <div className="aspect-video rounded-xl2 overflow-hidden border border-mist">
            <iframe
              src={embed}
              title={sermon.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : sermon.media_type === "audio" ? (
          <audio controls src={sermon.media_url} className="w-full">
            Your browser does not support audio playback.
          </audio>
        ) : (
          <a
            href={sermon.media_url}
            className="text-dusk-600 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Open the video in a new tab
          </a>
        )}
      </div>

      {sermon.description && (
        <div className="prose-body mt-8 text-ink/80">
          <p>{sermon.description}</p>
        </div>
      )}
    </Container>
  );
}
