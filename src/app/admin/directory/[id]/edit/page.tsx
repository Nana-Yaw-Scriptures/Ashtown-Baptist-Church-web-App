import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/authz";
import { MemberForm } from "@/components/admin/MemberForm";
import type { Member } from "@/lib/types";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await requireAdminPage();
  const { data } = await supabase.from("members").select("*").eq("id", id).single();
  const m = data as Member | null;
  if (!m) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/admin/directory/${m.id}`} className="text-sm text-dusk-600 hover:underline">← Back to member</Link>
        <h1 className="mt-2 font-display text-3xl">Edit {m.name}</h1>
      </div>
      <MemberForm member={m} />
    </div>
  );
}
