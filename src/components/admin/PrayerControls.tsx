"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPrayerStatus, deletePrayerRequest } from "@/actions/prayer";

export function PrayerControls({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function run(fn: () => Promise<any>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      {status !== "answered" && (
        <button
          onClick={() => run(() => setPrayerStatus(id, "answered"))}
          disabled={pending}
          className="rounded-full border border-mist px-3 py-1 hover:border-dusk-500"
        >
          Mark answered
        </button>
      )}
      {status !== "archived" && (
        <button
          onClick={() => run(() => setPrayerStatus(id, "archived"))}
          disabled={pending}
          className="rounded-full border border-mist px-3 py-1 hover:border-dusk-500"
        >
          Archive
        </button>
      )}
      {status !== "open" && (
        <button
          onClick={() => run(() => setPrayerStatus(id, "open"))}
          disabled={pending}
          className="rounded-full border border-mist px-3 py-1 hover:border-dusk-500"
        >
          Reopen
        </button>
      )}
      <button
        onClick={() => {
          if (window.confirm("Delete this request?"))
            run(() => deletePrayerRequest(id));
        }}
        disabled={pending}
        className="rounded-full px-3 py-1 text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>
  );
}
