"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setAnnouncementActive, deleteAnnouncement } from "@/actions/announcements";

export function AnnouncementControls({ id, active }: { id: string; active: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function run(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <button
        onClick={() => run(() => setAnnouncementActive(id, !active))}
        disabled={pending}
        className="rounded-full border border-mist px-3 py-1 hover:border-dusk-500"
      >
        {active ? "Turn off" : "Turn on"}
      </button>
      <button
        onClick={() => {
          if (window.confirm("Delete this announcement?")) run(() => deleteAnnouncement(id));
        }}
        disabled={pending}
        className="text-amber-500 hover:underline"
      >
        Delete
      </button>
    </div>
  );
}
