"use server";

import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/authz";
import type { ActionResult } from "@/lib/types";

export async function createAnnouncement(formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await checkAdmin();
  if (!ok) return { error: "Not authorized." };
  const message = String(formData.get("message") || "").trim();
  if (!message) return { error: "Please write a message." };
  const { error } = await supabase
    .from("announcements")
    .insert({ message, active: true });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/announcements");
  return { ok: true };
}

export async function setAnnouncementActive(id: string, active: boolean): Promise<ActionResult> {
  const { supabase, ok } = await checkAdmin();
  if (!ok) return { error: "Not authorized." };
  const { error } = await supabase.from("announcements").update({ active }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/announcements");
  return { ok: true };
}

export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  const { supabase, ok } = await checkAdmin();
  if (!ok) return { error: "Not authorized." };
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/announcements");
  return { ok: true };
}
