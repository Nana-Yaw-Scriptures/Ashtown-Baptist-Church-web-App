"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export async function registerForEvent(eventId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to register." };

  const { error } = await supabase
    .from("event_registrations")
    .insert({ event_id: eventId, user_id: user.id });

  if (error && !error.message.includes("duplicate")) {
    return { error: error.message };
  }
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function cancelRegistration(eventId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in." };

  const { error } = await supabase
    .from("event_registrations")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}
