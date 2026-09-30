import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui";
import { GalleryGrid } from "@/components/GalleryGrid";
import type { GalleryItem } from "@/lib/types";

export const metadata = { title: "Gallery · Ashtown Baptist Church" };

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const items = (data as GalleryItem[] | null) ?? [];

  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <p className="text-amber-500 mb-3 font-medium">Life together</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight">Gallery</h1>
        <p className="mt-4 text-ink/75 leading-relaxed">
          Photos and flyers from the life of our church.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="mt-12 text-ink/60">Nothing here yet. Check back soon.</p>
      ) : (
        <div className="mt-10">
          <GalleryGrid items={items} />
        </div>
      )}
    </Container>
  );
}
