"use client";

import { useMemo, useState } from "react";
import type { Sermon } from "@/lib/types";
import { SermonCard } from "@/components/SermonCard";

const input =
  "rounded-lg border border-mist px-3 py-2 text-sm focus:border-dusk-500 outline-none bg-white";

export function SermonBrowser({ sermons }: { sermons: Sermon[] }) {
  const [q, setQ] = useState("");
  const [series, setSeries] = useState("");
  const [speaker, setSpeaker] = useState("");

  const seriesList = useMemo(
    () => Array.from(new Set(sermons.map((s) => s.series).filter(Boolean))) as string[],
    [sermons]
  );
  const speakerList = useMemo(
    () => Array.from(new Set(sermons.map((s) => s.speaker).filter(Boolean))) as string[],
    [sermons]
  );

  const filtered = sermons.filter((s) => {
    const text = `${s.title} ${s.speaker} ${s.series ?? ""} ${s.scripture ?? ""}`.toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (series && s.series !== series) return false;
    if (speaker && s.speaker !== speaker) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search sermons..."
          className={`${input} flex-1 min-w-[12rem]`}
        />
        {seriesList.length > 0 && (
          <select value={series} onChange={(e) => setSeries(e.target.value)} className={input}>
            <option value="">All series</option>
            {seriesList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
        {speakerList.length > 0 && (
          <select value={speaker} onChange={(e) => setSpeaker(e.target.value)} className={input}>
            <option value="">All speakers</option>
            {speakerList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-ink/60">No sermons match your search.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SermonCard key={s.id} sermon={s} />
          ))}
        </div>
      )}
    </div>
  );
}
