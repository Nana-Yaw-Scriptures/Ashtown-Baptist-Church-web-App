"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/actions/admin";
import { Button } from "@/components/ui";
import type { ChurchEvent } from "@/lib/types";

const input =
  "w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-dusk-500 outline-none";

// Turn a stored ISO timestamp into the value a datetime-local input wants
// ("YYYY-MM-DDTHH:mm"), in the browser's local time.
function toLocalInput(iso?: string | null) {
  if (!iso) return undefined;
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

// No `event` prop = add mode. With an `event` = edit mode.
export function EventForm({ event }: { event?: ChurchEvent }) {
  const editing = !!event;
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = editing
        ? await updateEvent(event!.id, formData)
        : await createEvent(formData);
      if (res.error) return setError(res.error);
      if (editing) {
        router.push("/admin/events");
      } else {
        formRef.current?.reset();
      }
      router.refresh();
    });
  }

  return (
    <form
      ref={formRef}
      action={onSubmit}
      className="rounded-xl2 border border-mist bg-white p-6 space-y-3"
    >
      <h2 className="font-display text-lg">
        {editing ? "Edit event" : "Add an event"}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="title" required placeholder="Title" defaultValue={event?.title} className={`${input} sm:col-span-2`} />
        <input name="location" placeholder="Location" defaultValue={event?.location ?? ""} className={input} />
        <input name="category" placeholder="Category (e.g. Worship)" defaultValue={event?.category ?? ""} className={input} />
        <label className="text-sm text-sage flex flex-col gap-1">
          Starts
          <input name="starts_at" type="datetime-local" required defaultValue={toLocalInput(event?.starts_at)} className={input} />
        </label>
        <label className="text-sm text-sage flex flex-col gap-1">
          Ends (optional)
          <input name="ends_at" type="datetime-local" defaultValue={toLocalInput(event?.ends_at)} className={input} />
        </label>
        <input name="capacity" type="number" placeholder="Capacity (optional)" defaultValue={event?.capacity ?? undefined} className={input} />
      </div>
      <textarea name="description" rows={3} placeholder="Description" defaultValue={event?.description ?? ""} className={input} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Saving..." : editing ? "Save changes" : "Publish event"}
        </Button>
        {editing && (
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/events")}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
