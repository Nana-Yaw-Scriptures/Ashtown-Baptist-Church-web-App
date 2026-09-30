"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSermon, updateSermon } from "@/actions/admin";
import { Button } from "@/components/ui";
import type { Sermon } from "@/lib/types";

const input =
  "w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-dusk-500 outline-none";

// Used in two places: on the sermons admin page to add a sermon (no
// `sermon` prop), and on the edit page to change one (with `sermon`).
export function SermonForm({ sermon }: { sermon?: Sermon }) {
  const editing = !!sermon;
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = editing
        ? await updateSermon(sermon!.id, formData)
        : await createSermon(formData);
      if (res.error) return setError(res.error);
      if (editing) {
        router.push("/admin/sermons");
      } else {
        formRef.current?.reset();
      }
      router.refresh();
    });
  }

  const durationMin = sermon?.duration_seconds
    ? Math.round(sermon.duration_seconds / 60)
    : undefined;
  const preachedOn = sermon?.preached_on
    ? sermon.preached_on.slice(0, 10)
    : undefined;

  return (
    <form
      ref={formRef}
      action={onSubmit}
      className="rounded-xl2 border border-mist bg-white p-6 space-y-3"
    >
      <h2 className="font-display text-lg">
        {editing ? "Edit sermon" : "Add a sermon"}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="title" required placeholder="Title" defaultValue={sermon?.title} className={input} />
        <input name="speaker" required placeholder="Speaker" defaultValue={sermon?.speaker} className={input} />
        <input name="series" placeholder="Series (optional)" defaultValue={sermon?.series ?? ""} className={input} />
        <input name="scripture" placeholder="Scripture (optional)" defaultValue={sermon?.scripture ?? ""} className={input} />
        <select name="media_type" className={input} defaultValue={sermon?.media_type ?? "video"}>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
        <input name="duration_min" type="number" placeholder="Length (minutes)" defaultValue={durationMin} className={input} />
        <input name="media_url" required placeholder="Media URL (YouTube or audio link)" defaultValue={sermon?.media_url} className={`${input} sm:col-span-2`} />
        <input name="thumbnail_url" placeholder="Thumbnail URL (optional)" defaultValue={sermon?.thumbnail_url ?? ""} className={`${input} sm:col-span-2`} />
        <input name="preached_on" type="date" defaultValue={preachedOn} className={input} />
      </div>
      <textarea name="description" rows={3} placeholder="Description (optional)" defaultValue={sermon?.description ?? ""} className={input} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Saving..." : editing ? "Save changes" : "Publish sermon"}
        </Button>
        {editing && (
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/sermons")}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
