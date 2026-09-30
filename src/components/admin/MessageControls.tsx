"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markMessageHandled, deleteMessage } from "@/actions/contact";

export function MessageControls({ id, handled }: { id: string; handled: boolean }) {
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
        onClick={() => run(() => markMessageHandled(id, !handled))}
        disabled={pending}
        className="rounded-full border border-mist px-3 py-1 hover:border-dusk-500"
      >
        {handled ? "Mark unhandled" : "Mark handled"}
      </button>
      <button
        onClick={() => {
          if (window.confirm("Delete this message?")) run(() => deleteMessage(id));
        }}
        disabled={pending}
        className="text-amber-500 hover:underline"
      >
        Delete
      </button>
    </div>
  );
}
