"use server";

import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/authz";
import type { ActionResult } from "@/lib/types";

export async function createFund(formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await checkAdmin();
  if (!ok) return { error: "Not authorized." };
  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Please add a fund name." };
  const { error } = await supabase.from("funds").insert({
    name,
    description: String(formData.get("description") || "") || null,
    is_active: formData.get("is_active") !== "off",
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/funds");
  revalidatePath("/donate");
  return { ok: true };
}

export async function updateFund(id: string, formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await checkAdmin();
  if (!ok) return { error: "Not authorized." };
  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Please add a fund name." };
  const { error } = await supabase
    .from("funds")
    .update({
      name,
      description: String(formData.get("description") || "") || null,
      is_active: formData.get("is_active") !== "off",
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/funds");
  revalidatePath("/donate");
  return { ok: true };
}

export async function deleteFund(id: string): Promise<ActionResult> {
  const { supabase, ok } = await checkAdmin();
  if (!ok) return { error: "Not authorized." };
  const { error } = await supabase.from("funds").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/funds");
  revalidatePath("/donate");
  return { ok: true };
}
