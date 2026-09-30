"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ChurchEvent } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function EventCalendar({ events }: { events: ChurchEvent[] }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, ChurchEvent[]>();
    for (const e of events) {
      const key = new Date(e.starts_at).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const selectedEvents = selected ? byDay.get(selected) ?? [] : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_1fr] items-start">
      {/* Compact month grid */}
      <div className="rounded-xl2 border border-mist bg-white p-4 w-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg">
            {cursor.toLocaleString("en-CA", { month: "long", year: "numeric" })}
          </h3>
          <div className="flex gap-1">
            <button
              aria-label="Previous month"
              onClick={() => {
                setSelected(null);
                setCursor(new Date(year, month - 1, 1));
              }}
              className="h-7 w-7 rounded-full border border-mist text-ink/70 hover:border-dusk-500 hover:text-dusk-600"
            >
              ‹
            </button>
            <button
              aria-label="Next month"
              onClick={() => {
                setSelected(null);
                setCursor(new Date(year, month + 1, 1));
              }}
              className="h-7 w-7 rounded-full border border-mist text-ink/70 hover:border-dusk-500 hover:text-dusk-600"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs text-sage mb-1">
          {WEEKDAYS.map((d, i) => (
            <div key={i} className="py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            if (!date) return <div key={i} />;
            const key = date.toDateString();
            const has = byDay.has(key);
            const isSelected = selected === key;
            const isToday = key === new Date().toDateString();
            return (
              <button
                key={i}
                onClick={() => setSelected(has ? key : null)}
                disabled={!has}
                className={cn(
                  "relative h-9 rounded-lg text-sm flex items-center justify-center transition-colors",
                  has
                    ? "cursor-pointer text-ink font-medium hover:bg-dusk-50"
                    : "cursor-default text-ink/35",
                  isSelected && "bg-dusk-600 text-white hover:bg-dusk-600",
                  !isSelected && isToday && "ring-1 ring-amber-400"
                )}
              >
                {date.getDate()}
                {has && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-ink/50 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          A red dot marks a day with something on.
        </p>
      </div>

      {/* Selected day's events, beside the calendar */}
      <div className="w-full">
        <h3 className="font-display text-lg mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          {selected
            ? new Date(selected).toLocaleDateString("en-CA", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })
            : "Select a marked day"}
        </h3>
        {selected && selectedEvents.length === 0 && (
          <p className="text-sm text-ink/60">Nothing scheduled.</p>
        )}
        {!selected && (
          <p className="text-sm text-ink/60">
            Days with a red dot have something on. Tap one to see what&apos;s happening.
          </p>
        )}
        <div className="space-y-3">
          {selectedEvents.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.id}`}
              className="block rounded-lg border border-mist p-3 hover:border-dusk-500 transition-colors"
            >
              <p className="font-medium">{e.title}</p>
              <p className="text-sm text-ink/60">
                {formatTime(e.starts_at)}
                {e.location ? ` · ${e.location}` : ""}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
