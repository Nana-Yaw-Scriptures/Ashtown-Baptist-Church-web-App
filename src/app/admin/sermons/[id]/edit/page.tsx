import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SermonForm } from "@/components/admin/SermonForm";
import type { Sermon } from "@/lib/types";

export default async function EditSermonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("sermons")
    .select("*")
    .eq("id", id)
    .single();

  const sermon = data as Sermon | null;
  if (!sermon) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/sermons" className="text-sm text-dusk-600 hover:underline">
          ← Back to sermons
        </Link>
        <h1 className="mt-2 font-display text-3xl">Edit sermon</h1>
        <p className="mt-1 text-ink/70">Update the details and save your changes.</p>
      </div>
      <SermonForm sermon={sermon} />
    </div>
  );
}
