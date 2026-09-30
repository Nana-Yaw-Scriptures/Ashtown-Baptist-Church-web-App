import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/authz";
import { EditLink } from "@/components/admin/EditLink";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteMember } from "@/actions/members";
import type { Member } from "@/lib/types";

type Pair = [string, string | null | undefined];

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  const has = value != null && String(value).trim() !== "";
  return (
    <div className="py-2 border-b border-mist last:border-0">
      <dt className="text-xs text-sage">{label}</dt>
      <dd className={has ? "text-ink" : "text-ink/40"}>{has ? value : "—"}</dd>
    </div>
  );
}

function Section({ title, rows }: { title: string; rows: Pair[] }) {
  const hasAny = rows.some(([, v]) => v != null && String(v).trim() !== "");
  if (!hasAny) return null;
  return (
    <section className="rounded-xl2 border border-mist bg-white p-6">
      <h2 className="font-display text-lg mb-2">{title}</h2>
      <dl>{rows.map(([l, v]) => <Field key={l} label={l} value={v} />)}</dl>
    </section>
  );
}

export default async function MemberView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await requireAdminPage();
  const { data } = await supabase.from("members").select("*").eq("id", id).single();
  const m = data as Member | null;
  if (!m) notFound();

  const ministry = (m.areas_of_ministry ?? []).join(", ");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <Link href="/admin/directory" className="text-sm text-dusk-600 hover:underline">← Back to members</Link>
        <div className="flex gap-1">
          <EditLink href={`/admin/directory/${m.id}/edit`} label={`Edit ${m.name}`} />
          <DeleteButton action={deleteMember.bind(null, m.id)} confirmText={`Delete ${m.name} from the directory?`} redirectTo="/admin/directory" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {m.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.photo_url} alt={m.name} className="h-20 w-20 rounded-full object-cover border border-mist" />
        ) : (
          <div className="h-20 w-20 rounded-full bg-dusk-50 flex items-center justify-center text-2xl text-dusk-600 font-display">
            {m.name.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="font-display text-3xl">{m.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Personal" rows={[
          ["Date of birth", m.date_of_birth],
          ["Place of birth", m.place_of_birth],
          ["Contact 1", m.contact1],
          ["Contact 2", m.contact2],
          ["Nationality", m.nationality],
          ["Language spoken", m.language_spoken],
          ["Home town", m.home_town],
          ["Region", m.region],
        ]} />

        <Section title="Family" rows={[
          ["Marital status", m.marital_status],
          ["Marriage date", m.marriage_date],
          ["Marriage type", m.marriage_type],
          ["Spouse", m.spouse_name],
          ["Spouse status", m.spouse_status],
          ["Father", m.father_name],
          ["Father status", m.father_status],
          ["Father — membership", m.father_membership],
          ["Father contact", m.father_contact],
          ["Mother", m.mother_name],
          ["Mother status", m.mother_status],
          ["Mother — membership", m.mother_membership],
          ["Mother contact", m.mother_contact],
        ]} />

        <Section title="Residence & work" rows={[
          ["Postal address", m.postal_address],
          ["Email", m.email],
          ["Location (town/city)", m.location_city],
          ["Locality & street", m.locality_street],
          ["GPS address", m.gps_address],
          ["Employment", m.employment_type],
          ["Nature of work", m.work_nature],
          ["Business", m.business_name_location],
          ["School", m.school_name_location],
          ["Education level", m.education_level],
        ]} />

        <Section title="Church" rows={[
          ["Baptised", m.baptized],
          ["Baptism date", m.baptism_date],
          ["Baptism type", m.baptism_type],
          ["Tithe card no.", m.tithe_card_no],
          ["Welfare card no.", m.welfare_card_no],
          ["Area of ministry", ministry],
          ["Sunday School", m.sunday_school],
          ["House Fellowship", m.house_fellowship],
          ["Committee", m.committee],
          ["Committee (other)", m.committee_other],
        ]} />
      </div>
    </div>
  );
}
