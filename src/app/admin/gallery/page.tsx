import { createClient } from "@/lib/supabase/server";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { EditLink } from "@/components/admin/EditLink";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteGalleryItem } from "@/actions/admin";
import type { GalleryItem } from "@/lib/types";

export default async function AdminGallery() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });
  const items = (data as GalleryItem[] | null) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl">Gallery</h1>
        <p className="mt-2 text-ink/70">Upload photos and flyers from church life.</p>
      </div>

      <GalleryForm />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.id} className="rounded-xl2 border border-mist bg-white overflow-hidden">
            <div className="aspect-[4/3] bg-dusk-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image_url} alt={it.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{it.title}</p>
                <p className="text-xs text-sage capitalize">{it.category}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <EditLink href={`/admin/gallery/${it.id}/edit`} label={`Edit ${it.title}`} />
                <DeleteButton
                  action={deleteGalleryItem.bind(null, it.id)}
                  confirmText={`Delete "${it.title}"?`}
                />
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-ink/60">No images yet. Upload the first one above.</p>
        )}
      </div>
    </div>
  );
}
