import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GalleryEditForm } from "@/components/admin/GalleryEditForm";
import type { GalleryItem } from "@/lib/types";

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("gallery").select("*").eq("id", id).single();
  const item = data as GalleryItem | null;
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/gallery" className="text-sm text-dusk-600 hover:underline">
          ← Back to gallery
        </Link>
        <h1 className="mt-2 font-display text-3xl">Edit image details</h1>
      </div>
      <GalleryEditForm item={item} />
    </div>
  );
}
