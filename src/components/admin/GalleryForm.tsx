"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createGalleryItem } from "@/actions/admin";
import { Button } from "@/components/ui";

const input =
  "w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-dusk-500 outline-none";

export function GalleryForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await createGalleryItem(formData);
      if (res.error) return setError(res.error);
      formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <form ref={formRef} action={onSubmit} className="rounded-xl2 border border-mist bg-white p-6 space-y-3">
      <h2 className="font-display text-lg">Add a photo or flyer</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="title" required placeholder="Title" className={input} />
        <select name="category" className={input} defaultValue="photo">
          <option value="photo">Photo</option>
          <option value="flyer">Flyer</option>
        </select>
      </div>
      <input name="caption" placeholder="Caption (optional)" className={input} />
      <div>
        <label className="block text-sm text-sage mb-1">Image (JPG or PNG, under 8 MB)</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          required
          className="block w-full text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-dusk-600 file:text-white file:px-4 file:py-2 file:text-sm hover:file:bg-dusk-700"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={pending} variant="primary">
        {pending ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
}
