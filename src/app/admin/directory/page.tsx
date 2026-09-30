import { requireAdminPage } from "@/lib/authz";
import { DirectoryBrowser } from "@/components/admin/DirectoryBrowser";
import { MemberImport } from "@/components/admin/MemberImport";
import { ButtonLink } from "@/components/ui";
import type { Member } from "@/lib/types";

export default async function AdminDirectory() {
  const supabase = await requireAdminPage();
  const { data } = await supabase
    .from("members")
    .select("*")
    .order("name", { ascending: true });
  const members = (data as Member[] | null) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl">Members</h1>
          <p className="mt-2 text-ink/70">The church membership register. Not website accounts.</p>
        </div>
        <ButtonLink href="/admin/directory/new" variant="primary">Add member</ButtonLink>
      </div>

      <MemberImport />

      {members.length === 0 ? (
        <p className="text-ink/60">No members yet. Add one, or import a spreadsheet.</p>
      ) : (
        <DirectoryBrowser members={members} />
      )}
    </div>
  );
}
