"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPrayerRequest } from "@/actions/prayer";
import { Button } from "@/components/ui";

export function PrayerSubmitForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createPrayerRequest(formData);
      if (res.error) {
        setError(res.error);
        return;
      }
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    });
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="primary">
        Share a request
      </Button>
    );
  }

  return (
    <form
      ref={formRef}
      action={onSubmit}
      className="rounded-xl2 border border-mist bg-white p-6 space-y-4"
    >
      <div>
        <label className="block text-sm text-sage mb-1">Title</label>
        <input
          name="title"
          required
          placeholder="What should we pray for?"
          className="w-full rounded-lg border border-mist px-3 py-2.5 text-sm focus:border-dusk-500 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm text-sage mb-1">Your request</label>
        <textarea
          name="body"
          required
          rows={4}
          placeholder="Share as much or as little as you like."
          className="w-full rounded-lg border border-mist px-3 py-2.5 text-sm focus:border-dusk-500 outline-none resize-y"
        />
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="is_anonymous" className="accent-dusk-600" />
          Post anonymously
        </label>
        <label className="flex items-center gap-2">
          <span>Visibility</span>
          <select
            name="visibility"
            className="rounded-lg border border-mist px-2 py-1 focus:border-dusk-500 outline-none"
          >
            <option value="public">Whole church</option>
            <option value="private">Staff only</option>
          </select>
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Posting..." : "Post request"}
        </Button>
        <Button onClick={() => setOpen(false)} variant="ghost">
          Cancel
        </Button>
      </div>
    </form>
  );
}
