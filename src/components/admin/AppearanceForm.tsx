"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateHeroImage, removeHeroImage,
  updateFeatureImage, removeFeatureImage,
} from "@/actions/appearance";
import { Button } from "@/components/ui";

export function AppearanceForm({
  target,
  currentUrl,
  title,
  help,
  contain = false,
  caption = null,
}: {
  target: "hero" | "feature";
  currentUrl: string | null;
  title: string;
  help: string;
  contain?: boolean;
  caption?: string | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const update = target === "hero" ? updateHeroImage : updateFeatureImage;
  const remove = target === "hero" ? removeHeroImage : removeFeatureImage;

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await update(formData);
      if (res.error) return setError(res.error);
      formRef.current?.reset();
      router.refresh();
    });
  }

  function onRemove() {
    if (!window.confirm("Remove this image?")) return;
    setError(null);
    startTransition(async () => {
      const res = await remove();
      if (res.error) return setError(res.error);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-mist bg-white p-6 space-y-4 shadow-[0_1px_2px_rgba(16,33,61,0.04)]">
      <div>
        <h2 className="font-display text-lg mb-1">{title}</h2>
        <p className="text-sm text-sage mb-3">{help}</p>
        <div className={`relative overflow-hidden rounded-xl border border-mist bg-dusk-50 ${contain ? "aspect-[4/3]" : "aspect-[16/6]"}`}>
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt="Current" className={`h-full w-full ${contain ? "object-contain" : "object-cover"}`} />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm text-ink/50">
              Nothing set yet.
            </div>
          )}
        </div>
      </div>

      <form ref={formRef} action={onSubmit} className="space-y-3">
        <input
          name="image"
          type="file"
          accept="image/*"
          required
          className="block w-full text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-dusk-600 file:text-white file:px-4 file:py-2 file:text-sm hover:file:bg-dusk-700"
        />
        {target === "feature" && (
          <div>
            <label className="block text-sm text-sage mb-1">Description (optional)</label>
            <textarea
              name="caption"
              defaultValue={caption ?? ""}
              rows={3}
              placeholder="A short description for this flyer — e.g. Day 5: A Heart of Worship."
              className="w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-dusk-500 outline-none"
            />
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <Button type="submit" disabled={pending} variant="primary">
            {pending ? "Saving..." : "Save"}
          </Button>
          {currentUrl && (
            <Button type="button" variant="ghost" onClick={onRemove} disabled={pending}>
              Remove
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
