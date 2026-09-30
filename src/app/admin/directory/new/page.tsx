import Link from "next/link";
import { requireAdminPage } from "@/lib/authz";
import { MemberForm } from "@/components/admin/MemberForm";

export default async function NewMemberPage() {
  await requireAdminPage();
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/directory" className="text-sm text-dusk-600 hover:underline">← Back to members</Link>
        <h1 className="mt-2 font-display text-3xl">Add member</h1>
      </div>
      <MemberForm />
    </div>
  );
}
