"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PrayerRequest } from "@/lib/types";
import { togglePrayed } from "@/actions/prayer";
import { formatDate } from "@/lib/utils";

export function PrayerCard({
  request,
  authorName,
  hasPrayed,
}: {
  request: PrayerRequest;
  authorName: string;
  hasPrayed: boolean;
}) {
  const [prayed, setPrayed] = useState(hasPrayed);
  const [count, setCount] = useState(request.pray_count ?? 0);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function pray() {
    startTransition(async () => {
      const res = await togglePrayed(request.id);
      if (!res.error) {
        setPrayed(!prayed);
        setCount((c) => (prayed ? c - 1 : c + 1));
        router.refresh();
      }
    });
  }

  return (
    <div className="rounded-xl2 border border-mist bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg">{request.title}</h3>
          <p className="text-xs text-sage mt-0.5">
            {request.is_anonymous ? "Anonymous" : authorName} ·{" "}
            {formatDate(request.created_at)}
          </p>
        </div>
        {request.status === "answered" && (
          <span className="rounded-full bg-dusk-50 text-dusk-700 px-2.5 py-1 text-xs">
            Answered
          </span>
        )}
      </div>

      <p className="mt-3 text-ink/80 leading-relaxed whitespace-pre-wrap">
        {request.body}
      </p>

      <button
        onClick={pray}
        disabled={pending}
        className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
          prayed
            ? "border-dusk-600 bg-dusk-50 text-dusk-700"
            : "border-mist hover:border-dusk-500"
        }`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={prayed ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
          <path d="M12 21s-7-4.35-9.5-8.5C1 9 3 5.5 6.5 5.5c2 0 3.5 1.5 5.5 3.5 2-2 3.5-3.5 5.5-3.5C21 5.5 23 9 21.5 12.5 19 16.65 12 21 12 21z" strokeLinejoin="round" />
        </svg>
        {prayed ? "You prayed" : "I prayed"}
        {count > 0 && <span className="text-ink/50">· {count}</span>}
      </button>
    </div>
  );
}
