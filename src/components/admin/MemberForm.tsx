"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMember, updateMember } from "@/actions/members";
import { Button } from "@/components/ui";
import type { Member } from "@/lib/types";
import {
  REGIONS, MARITAL_STATUS, ALIVE_STATUS, MEMBERSHIP_STATUS, EMPLOYMENT_TYPES,
  BAPTIZED, AREAS_OF_MINISTRY, SUNDAY_SCHOOL, HOUSE_FELLOWSHIPS, COMMITTEES,
} from "@/lib/church";

const inp =
  "w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-dusk-500 outline-none";
const label = "block text-xs text-sage mb-1";

export function MemberForm({ member }: { member?: Member }) {
  const editing = !!member;
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = editing ? await updateMember(member!.id, formData) : await createMember(formData);
      if (res.error) return setError(res.error);
      router.push(editing ? `/admin/directory/${member!.id}` : "/admin/directory");
      router.refresh();
    });
  }

  const Text = ({ name, label: l, dv }: { name: string; label: string; dv?: string | null }) => (
    <div>
      <label className={label}>{l}</label>
      <input name={name} defaultValue={dv ?? ""} className={inp} />
    </div>
  );
  const Select = ({ name, label: l, options, dv }: { name: string; label: string; options: string[]; dv?: string | null }) => (
    <div>
      <label className={label}>{l}</label>
      <select name={name} defaultValue={dv ?? ""} className={inp}>
        <option value="">—</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl2 border border-mist bg-white p-6">
      <h2 className="font-display text-lg mb-4">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );

  const chosen = new Set(member?.areas_of_ministry ?? []);

  return (
    <form ref={formRef} action={onSubmit} className="space-y-6">
      <Section title="Photo">
        <div className="sm:col-span-2 flex items-center gap-4">
          {member?.photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.photo_url} alt={member.name} className="h-16 w-16 rounded-full object-cover border border-mist" />
          )}
          <div>
            <label className={label}>Passport photo (image, under 8 MB)</label>
            <input name="photo" type="file" accept="image/*" className="block w-full text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-dusk-600 file:text-white file:px-4 file:py-2 file:text-sm hover:file:bg-dusk-700" />
          </div>
        </div>
      </Section>

      <Section title="Personal">
        <div className="sm:col-span-2"><label className={label}>Name *</label><input name="name" required defaultValue={member?.name} className={inp} /></div>
        <Text name="date_of_birth" label="Date of birth" dv={member?.date_of_birth} />
        <Text name="place_of_birth" label="Place of birth" dv={member?.place_of_birth} />
        <Text name="contact1" label="Contact number 1" dv={member?.contact1} />
        <Text name="contact2" label="Contact number 2" dv={member?.contact2} />
        <Text name="nationality" label="Nationality" dv={member?.nationality} />
        <Text name="language_spoken" label="Language spoken" dv={member?.language_spoken} />
        <Text name="home_town" label="Home town" dv={member?.home_town} />
        <Select name="region" label="Region" options={REGIONS} dv={member?.region} />
      </Section>

      <Section title="Family">
        <Select name="marital_status" label="Marital status" options={MARITAL_STATUS} dv={member?.marital_status} />
        <Text name="marriage_date" label="Marriage date" dv={member?.marriage_date} />
        <Text name="marriage_type" label="Marriage type" dv={member?.marriage_type} />
        <Text name="spouse_name" label="Spouse name" dv={member?.spouse_name} />
        <Select name="spouse_status" label="Spouse status" options={ALIVE_STATUS} dv={member?.spouse_status} />
        <div className="sm:col-span-2 h-px bg-mist" />
        <Text name="father_name" label="Father's name" dv={member?.father_name} />
        <Select name="father_status" label="Father's status" options={ALIVE_STATUS} dv={member?.father_status} />
        <Select name="father_membership" label="Father — church member?" options={MEMBERSHIP_STATUS} dv={member?.father_membership} />
        <Text name="father_contact" label="Father's contact" dv={member?.father_contact} />
        <Text name="mother_name" label="Mother's name" dv={member?.mother_name} />
        <Select name="mother_status" label="Mother's status" options={ALIVE_STATUS} dv={member?.mother_status} />
        <Select name="mother_membership" label="Mother — church member?" options={MEMBERSHIP_STATUS} dv={member?.mother_membership} />
        <Text name="mother_contact" label="Mother's contact" dv={member?.mother_contact} />
      </Section>

      <Section title="Residence">
        <Text name="postal_address" label="Postal address" dv={member?.postal_address} />
        <Text name="email" label="Email" dv={member?.email} />
        <Text name="location_city" label="Location (town/city)" dv={member?.location_city} />
        <Text name="locality_street" label="Locality & street" dv={member?.locality_street} />
        <Text name="gps_address" label="GPS address" dv={member?.gps_address} />
      </Section>

      <Section title="Work">
        <Select name="employment_type" label="Employment type" options={EMPLOYMENT_TYPES} dv={member?.employment_type} />
        <Text name="work_nature" label="Nature of work" dv={member?.work_nature} />
        <Text name="business_name_location" label="Business name & location" dv={member?.business_name_location} />
        <Text name="school_name_location" label="School name & location" dv={member?.school_name_location} />
        <Text name="education_level" label="Level of education" dv={member?.education_level} />
      </Section>

      <Section title="Baptism">
        <Select name="baptized" label="Baptised?" options={BAPTIZED} dv={member?.baptized} />
        <Text name="baptism_date" label="Baptism date" dv={member?.baptism_date} />
        <Text name="baptism_type" label="Baptism type" dv={member?.baptism_type} />
        <Text name="tithe_card_no" label="Tithe card no." dv={member?.tithe_card_no} />
        <Text name="welfare_card_no" label="Welfare card no." dv={member?.welfare_card_no} />
      </Section>

      <div className="rounded-xl2 border border-mist bg-white p-6">
        <h2 className="font-display text-lg mb-4">Area of ministry</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS_OF_MINISTRY.map((a) => (
            <label key={a} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="areas_of_ministry" value={a} defaultChecked={chosen.has(a)} className="accent-dusk-600" />
              {a}
            </label>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-3 mt-5">
          <Select name="sunday_school" label="Sunday School" options={SUNDAY_SCHOOL} dv={member?.sunday_school} />
          <Select name="house_fellowship" label="House Fellowship" options={HOUSE_FELLOWSHIPS} dv={member?.house_fellowship} />
          <Select name="committee" label="Committee / Board" options={COMMITTEES} dv={member?.committee} />
        </div>
        <div className="mt-3">
          <Text name="committee_other" label="Committee — if other, specify" dv={member?.committee_other} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Saving..." : editing ? "Save changes" : "Add member"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/directory")}>Cancel</Button>
      </div>
    </form>
  );
}
