"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkAdmin } from "@/lib/authz";
import type { ActionResult } from "@/lib/types";

// Public: anyone can send a message.
export async function sendMessage(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!name || !email || !body) {
    return { error: "Please fill in your name, email, and message." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    subject: subject || null,
    body,
  });
  if (error) return { error: error.message };
  return { ok: true };
}

// Admin: manage received messages.
export async function markMessageHandled(id: string, handled: boolean): Promise<ActionResult> {
  const { supabase, ok } = await checkAdmin();
  if (!ok) return { error: "Not authorized." };
  const { error } = await supabase.from("contact_messages").update({ handled }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const { supabase, ok } = await checkAdmin();
  if (!ok) return { error: "Not authorized." };
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { ok: true };
}
