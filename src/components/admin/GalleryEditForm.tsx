"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGalleryItem } from "@/actions/admin";
import { Button } from "@/components/ui";
import type { GalleryItem } from "@/lib/types";

const input =
  "w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-dusk-500 outline-none";

export function GalleryEditForm({ item }: { item: GalleryItem }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await updateGalleryItem(item.id, formData);
      if (res.error) return setError(res.error);
      router.push("/admin/gallery");
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="rounded-xl2 border border-mist bg-white p-6 space-y-3">
      <div className="aspect-[4/3] max-w-xs overflow-hidden rounded-lg border border-mist">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="title" required defaultValue={item.title} className={input} />
        <select name="category" defaultValue={item.category} className={input}>
          <option value="photo">Photo</option>
          <option value="flyer">Flyer</option>
        </select>
      </div>
      <input name="caption" defaultValue={item.caption ?? ""} placeholder="Caption (optional)" className={input} />
      <p className="text-xs text-ink/50">
        To change the picture itself, delete this item and upload the new one.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/gallery")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
