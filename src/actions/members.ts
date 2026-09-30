"use server";

import Papa from "papaparse";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/authz";
import type { ActionResult } from "@/lib/types";

// All plain text fields, matching the form input names and CSV columns.
const TEXT_FIELDS = [
  "name", "date_of_birth", "place_of_birth", "contact1", "contact2",
  "nationality", "language_spoken", "home_town", "region",
  "marital_status", "marriage_date", "marriage_type", "spouse_name", "spouse_status",
  "father_name", "father_status", "father_membership", "father_contact",
  "mother_name", "mother_status", "mother_membership", "mother_contact",
  "postal_address", "email", "location_city", "locality_street", "gps_address",
  "employment_type", "work_nature", "business_name_location", "school_name_location",
  "education_level", "baptized", "baptism_date", "baptism_type",
  "tithe_card_no", "welfare_card_no", "sunday_school", "house_fellowship",
  "committee", "committee_other",
] as const;

function fieldsFromForm(formData: FormData) {
  const obj: Record<string, unknown> = {};
  for (const key of TEXT_FIELDS) {
    const v = String(formData.get(key) || "").trim();
    obj[key] = v || null;
  }
  obj.areas_of_ministry = formData.getAll("areas_of_ministry").map(String);
  return obj;
}

async function uploadPhoto(supabase: any, file: File) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from("members")
    .upload(path, bytes, { contentType: file.type || "image/jpeg", upsert: false });
  if (error) return { error: error.message };
  const { data } = supabase.storage.from("members").getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function createMember(formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await checkAdmin();
  if (!ok) return { error: "Not authorized." };

  const record = fieldsFromForm(formData);
  if (!record.name) return { error: "Please enter a name." };

  const file = formData.get("photo") as File | null;
  if (file && file.size > 0) {
    if (!file.type.startsWith("image/")) return { error: "Photo must be an image." };
    if (file.size > 8 * 1024 * 1024) return { error: "Photo must be under 8 MB." };
    const up = await uploadPhoto(supabase, file);
    if ("error" in up) return { error: up.error };
    record.photo_url = up.url;
    record.photo_path = up.path;
  }

  const { error } = await supabase.from("members").insert(record);
  if (error) return { error: error.message };
  revalidatePath("/admin/directory");
  return { ok: true };
}

export async function updateMember(id: string, formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await checkAdmin();
  if (!ok) return { error: "Not authorized." };

  const record = fieldsFromForm(formData);
  if (!record.name) return { error: "Please enter a name." };

  const file = formData.get("photo") as File | null;
  if (file && file.size > 0) {
    if (!file.type.startsWith("image/")) return { error: "Photo must be an image." };
    if (file.size > 8 * 1024 * 1024) return { error: "Photo must be under 8 MB." };
    const up = await uploadPhoto(supabase, file);
    if ("error" in up) return { error: up.error };
    record.photo_url = up.url;
    record.photo_path = up.path;
  }

  const { error } = await supabase.from("members").update(record).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/directory");
  revalidatePath(`/admin/directory/${id}`);
  return { ok: true };
}

export async function deleteMember(id: string): Promise<ActionResult> {
  const { supabase, ok } = await checkAdmin();
  if (!ok) return { error: "Not authorized." };
  const { data: m } = await supabase.from("members").select("photo_path").eq("id", id).single();
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) return { error: error.message };
  if (m?.photo_path) await supabase.storage.from("members").remove([m.photo_path]);
  revalidatePath("/admin/directory");
  return { ok: true };
}

// Map a normalized CSV header to a member column.
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const HEADER_MAP: Record<string, string> = {
  name: "name",
  dateofbirth: "date_of_birth",
  placeofbirth: "place_of_birth",
  contact1: "contact1", contactnumber1: "contact1",
  contact2: "contact2", contactnumber2: "contact2",
  nationality: "nationality",
  languagespoken: "language_spoken",
  hometown: "home_town",
  region: "region",
  maritalstatus: "marital_status",
  marriagedate: "marriage_date",
  marriagetype: "marriage_type",
  spousename: "spouse_name",
  spousestatus: "spouse_status",
  fathername: "father_name",
  fatherstatus: "father_status",
  fathermembership: "father_membership",
  fathercontact: "father_contact",
  mothername: "mother_name",
  motherstatus: "mother_status",
  mothermembership: "mother_membership",
  mothercontact: "mother_contact",
  postaladdress: "postal_address",
  email: "email",
  locationcity: "location_city", location: "location_city", locationtowncity: "location_city",
  localitystreet: "locality_street", localitystreetname: "locality_street",
  gpsaddress: "gps_address",
  employmenttype: "employment_type",
  worknature: "work_nature", natureofwork: "work_nature",
  businessnamelocation: "business_name_location",
  schoolnamelocation: "school_name_location",
  educationlevel: "education_level", levelofeducation: "education_level",
  baptized: "baptized", baptist: "baptized",
  baptismdate: "baptism_date",
  baptismtype: "baptism_type",
  tithecardno: "tithe_card_no",
  welfarecardno: "welfare_card_no",
  areasofministry: "areas_of_ministry", areaofministry: "areas_of_ministry",
  sundayschool: "sunday_school",
  housefellowship: "house_fellowship",
  committee: "committee",
  committeeother: "committee_other",
};

export async function importMembers(formData: FormData): Promise<ActionResult & { count?: number }> {
  const { supabase, ok } = await checkAdmin();
  if (!ok) return { error: "Not authorized." };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Please choose a CSV file." };

  const text = await file.text();
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h,
  });
  if (!parsed.data || parsed.data.length === 0) {
    return { error: "No rows found in the file." };
  }

  const rows: Record<string, unknown>[] = [];
  for (const raw of parsed.data) {
    const rec: Record<string, unknown> = {};
    for (const [header, value] of Object.entries(raw)) {
      const col = HEADER_MAP[norm(header)];
      if (!col) continue;
      const val = String(value ?? "").trim();
      if (col === "areas_of_ministry") {
        rec[col] = val ? val.split(/[;,]/).map((s) => s.trim()).filter(Boolean) : [];
      } else {
        rec[col] = val || null;
      }
    }
    if (rec.name) rows.push(rec);
  }

  if (rows.length === 0) {
    return { error: "No members with a name were found. Check that the file has a Name column." };
  }

  const { error } = await supabase.from("members").insert(rows);
  if (error) return { error: error.message };
  revalidatePath("/admin/directory");
  return { ok: true, count: rows.length };
}
