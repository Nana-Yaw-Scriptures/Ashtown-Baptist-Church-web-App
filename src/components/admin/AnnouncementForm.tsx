"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAnnouncement } from "@/actions/announcements";
import { Button } from "@/components/ui";

export function AnnouncementForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createAnnouncement(formData);
      if (res.error) return setError(res.error);
      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <form ref={formRef} action={onSubmit} className="rounded-xl2 border border-mist bg-white p-6 space-y-3">
      <h2 className="font-display text-lg">Post an announcement</h2>
      <p className="text-sm text-ink/60">
        The most recent active announcement shows as a bar across the top of the site.
      </p>
      <textarea
        name="message"
        required
        rows={2}
        placeholder="e.g. No evening service this Sunday."
        className="w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-dusk-500 outline-none"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={pending} variant="primary">
        {pending ? "Posting..." : "Post announcement"}
      </Button>
    </form>
  );
}
