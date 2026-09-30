"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export async function createPrayerRequest(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const isAnonymous = formData.get("is_anonymous") === "on";
  const isPublic = formData.get("visibility") !== "private";

  if (!title || !body) return { error: "Please add a title and a request." };

  const { error } = await supabase.from("prayer_requests").insert({
    user_id: user.id,
    title,
    body,
    is_anonymous: isAnonymous,
    is_public: isPublic,
  });

  if (error) return { error: error.message };
  revalidatePath("/prayer");
  return { ok: true };
}

export async function togglePrayed(requestId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const { data: existing } = await supabase
    .from("prayer_interactions")
    .select("id")
    .eq("prayer_request_id", requestId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("prayer_interactions").delete().eq("id", existing.id);
  } else {
    await supabase
      .from("prayer_interactions")
      .insert({ prayer_request_id: requestId, user_id: user.id });
  }

  revalidatePath("/prayer");
  return { ok: true };
}

export async function setPrayerStatus(requestId: string, status: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("prayer_requests")
    .update({ status })
    .eq("id", requestId);
  if (error) return { error: error.message };
  revalidatePath("/prayer");
  revalidatePath("/admin/prayer");
  return { ok: true };
}

export async function deletePrayerRequest(requestId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("prayer_requests")
    .delete()
    .eq("id", requestId);
  if (error) return { error: error.message };
  revalidatePath("/prayer");
  return { ok: true };
}
