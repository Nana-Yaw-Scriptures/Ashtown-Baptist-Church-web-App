import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/authz";
import { FundForm } from "@/components/admin/FundForm";
import type { Fund } from "@/lib/types";

export default async function EditFundPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await requireAdminPage();
  const { data } = await supabase.from("funds").select("*").eq("id", id).single();
  const fund = data as Fund | null;
  if (!fund) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/funds" className="text-sm text-dusk-600 hover:underline">← Back to funds</Link>
        <h1 className="mt-2 font-display text-3xl">Edit fund</h1>
      </div>
      <FundForm fund={fund} />
    </div>
  );
}
