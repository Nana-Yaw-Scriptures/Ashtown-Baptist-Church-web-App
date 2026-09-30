"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

// Content actions (sermons, events, gallery) require STAFF = admin or media.
// Sensitive areas (members) require ADMIN. RLS is the real gate; these
// checks return a clean error before hitting the database.
async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, ok: false as const };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return { supabase, ok: profile?.role === "admin" || profile?.role === "media" };
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, ok: false as const };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return { supabase, ok: profile?.role === "admin" };
}

// ---------- Sermons ----------
export async function createSermon(formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await requireStaff();
  if (!ok) return { error: "Not authorized." };

  const durationMin = Number(formData.get("duration_min") || 0);
  const { error } = await supabase.from("sermons").insert({
    title: String(formData.get("title")),
    speaker: String(formData.get("speaker")),
    description: String(formData.get("description") || ""),
    scripture: String(formData.get("scripture") || ""),
    series: String(formData.get("series") || ""),
    media_type: String(formData.get("media_type") || "video"),
    media_url: String(formData.get("media_url")),
    thumbnail_url: String(formData.get("thumbnail_url") || "") || null,
    duration_seconds: durationMin ? durationMin * 60 : null,
    preached_on: String(formData.get("preached_on")) || new Date().toISOString().slice(0, 10),
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/sermons");
  revalidatePath("/sermons");
  return { ok: true };
}

export async function updateSermon(id: string, formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await requireStaff();
  if (!ok) return { error: "Not authorized." };

  const durationMin = Number(formData.get("duration_min") || 0);
  const { error } = await supabase
    .from("sermons")
    .update({
      title: String(formData.get("title")),
      speaker: String(formData.get("speaker")),
      description: String(formData.get("description") || ""),
      scripture: String(formData.get("scripture") || ""),
      series: String(formData.get("series") || ""),
      media_type: String(formData.get("media_type") || "video"),
      media_url: String(formData.get("media_url")),
      thumbnail_url: String(formData.get("thumbnail_url") || "") || null,
      duration_seconds: durationMin ? durationMin * 60 : null,
      preached_on:
        String(formData.get("preached_on")) || new Date().toISOString().slice(0, 10),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/sermons");
  revalidatePath("/sermons");
  revalidatePath(`/sermons/${id}`);
  return { ok: true };
}

export async function deleteSermon(id: string): Promise<ActionResult> {
  const { supabase, ok } = await requireStaff();
  if (!ok) return { error: "Not authorized." };
  const { error } = await supabase.from("sermons").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/sermons");
  revalidatePath("/sermons");
  return { ok: true };
}

// ---------- Events ----------
export async function createEvent(formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await requireStaff();
  if (!ok) return { error: "Not authorized." };

  const { error } = await supabase.from("events").insert({
    title: String(formData.get("title")),
    description: String(formData.get("description") || ""),
    location: String(formData.get("location") || ""),
    category: String(formData.get("category") || ""),
    starts_at: new Date(String(formData.get("starts_at"))).toISOString(),
    ends_at: formData.get("ends_at")
      ? new Date(String(formData.get("ends_at"))).toISOString()
      : null,
    capacity: formData.get("capacity") ? Number(formData.get("capacity")) : null,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { ok: true };
}

export async function updateEvent(id: string, formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await requireStaff();
  if (!ok) return { error: "Not authorized." };

  const { error } = await supabase
    .from("events")
    .update({
      title: String(formData.get("title")),
      description: String(formData.get("description") || ""),
      location: String(formData.get("location") || ""),
      category: String(formData.get("category") || ""),
      starts_at: new Date(String(formData.get("starts_at"))).toISOString(),
      ends_at: formData.get("ends_at")
        ? new Date(String(formData.get("ends_at"))).toISOString()
        : null,
      capacity: formData.get("capacity") ? Number(formData.get("capacity")) : null,
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  return { ok: true };
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const { supabase, ok } = await requireStaff();
  if (!ok) return { error: "Not authorized." };
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { ok: true };
}

// ---------- Gallery ----------
export async function createGalleryItem(formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await requireStaff();
  if (!ok) return { error: "Not authorized." };

  const file = formData.get("image") as File | null;
  const title = String(formData.get("title") || "").trim();
  const caption = String(formData.get("caption") || "").trim();
  const category = String(formData.get("category") || "photo");

  if (!title) return { error: "Please add a title." };
  if (!file || file.size === 0) return { error: "Please choose an image." };
  if (!file.type.startsWith("image/")) return { error: "Only image files are allowed." };
  if (file.size > 8 * 1024 * 1024) return { error: "Image must be under 8 MB." };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${category}/${randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage
    .from("gallery")
    .upload(path, bytes, { contentType: file.type || "image/jpeg", upsert: false });
  if (upErr) return { error: upErr.message };

  const { data: pub } = supabase.storage.from("gallery").getPublicUrl(path);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("gallery").insert({
    title,
    caption: caption || null,
    category,
    image_url: pub.publicUrl,
    storage_path: path,
    created_by: user?.id || null,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { ok: true };
}

export async function updateGalleryItem(id: string, formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await requireStaff();
  if (!ok) return { error: "Not authorized." };

  const title = String(formData.get("title") || "").trim();
  const caption = String(formData.get("caption") || "").trim();
  const category = String(formData.get("category") || "photo");
  if (!title) return { error: "Please add a title." };

  const { error } = await supabase
    .from("gallery")
    .update({ title, caption: caption || null, category })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { ok: true };
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  const { supabase, ok } = await requireStaff();
  if (!ok) return { error: "Not authorized." };

  const { data: item } = await supabase
    .from("gallery")
    .select("storage_path")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return { error: error.message };

  if (item?.storage_path) {
    await supabase.storage.from("gallery").remove([item.storage_path]);
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { ok: true };
}

// ---------- Members (admin only) ----------
export async function setMemberRole(
  userId: string,
  role: "member" | "admin" | "media"
): Promise<ActionResult> {
  const { supabase, ok } = await requireAdmin();
  if (!ok) return { error: "Not authorized." };
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/members");
  return { ok: true };
}
