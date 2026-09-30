"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { checkStaff } from "@/lib/authz";
import type { ActionResult } from "@/lib/types";

export async function updateHeroImage(formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await checkStaff();
  if (!ok) return { error: "Not authorized." };

  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { error: "Please choose an image." };
  if (!file.type.startsWith("image/")) return { error: "Only image files are allowed." };
  if (file.size > 8 * 1024 * 1024) return { error: "Image must be under 8 MB." };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `hero-${randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage
    .from("site")
    .upload(path, bytes, { contentType: file.type || "image/jpeg", upsert: false });
  if (upErr) return { error: upErr.message };

  const { data: pub } = supabase.storage.from("site").getPublicUrl(path);
  const { data: cur } = await supabase
    .from("site_settings").select("hero_image_path").eq("id", "main").single();

  const { error } = await supabase
    .from("site_settings")
    .update({ hero_image_url: pub.publicUrl, hero_image_path: path, updated_at: new Date().toISOString() })
    .eq("id", "main");
  if (error) return { error: error.message };

  if (cur?.hero_image_path) await supabase.storage.from("site").remove([cur.hero_image_path]);

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/appearance");
  return { ok: true };
}

export async function removeHeroImage(): Promise<ActionResult> {
  const { supabase, ok } = await checkStaff();
  if (!ok) return { error: "Not authorized." };

  const { data: cur } = await supabase
    .from("site_settings").select("hero_image_path").eq("id", "main").single();

  const { error } = await supabase
    .from("site_settings")
    .update({ hero_image_url: null, hero_image_path: null, updated_at: new Date().toISOString() })
    .eq("id", "main");
  if (error) return { error: error.message };

  if (cur?.hero_image_path) await supabase.storage.from("site").remove([cur.hero_image_path]);

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/appearance");
  return { ok: true };
}

export async function updateFeatureImage(formData: FormData): Promise<ActionResult> {
  const { supabase, ok } = await checkStaff();
  if (!ok) return { error: "Not authorized." };

  const file = formData.get("image") as File | null;
  const caption = String(formData.get("caption") || "").trim();
  if (!file || file.size === 0) return { error: "Please choose an image." };
  if (!file.type.startsWith("image/")) return { error: "Only image files are allowed." };
  if (file.size > 8 * 1024 * 1024) return { error: "Image must be under 8 MB." };

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `feature-${randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage
    .from("site")
    .upload(path, bytes, { contentType: file.type || "image/jpeg", upsert: false });
  if (upErr) return { error: upErr.message };

  const { data: pub } = supabase.storage.from("site").getPublicUrl(path);
  const { data: cur } = await supabase
    .from("site_settings").select("feature_image_path").eq("id", "main").single();

  const { error } = await supabase
    .from("site_settings")
    .update({ feature_image_url: pub.publicUrl, feature_image_path: path, feature_caption: caption || null, updated_at: new Date().toISOString() })
    .eq("id", "main");
  if (error) return { error: error.message };

  if (cur?.feature_image_path) await supabase.storage.from("site").remove([cur.feature_image_path]);

  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/admin/appearance");
  return { ok: true };
}

export async function removeFeatureImage(): Promise<ActionResult> {
  const { supabase, ok } = await checkStaff();
  if (!ok) return { error: "Not authorized." };

  const { data: cur } = await supabase
    .from("site_settings").select("feature_image_path").eq("id", "main").single();

  const { error } = await supabase
    .from("site_settings")
    .update({ feature_image_url: null, feature_image_path: null, feature_caption: null, updated_at: new Date().toISOString() })
    .eq("id", "main");
  if (error) return { error: error.message };

  if (cur?.feature_image_path) await supabase.storage.from("site").remove([cur.feature_image_path]);

  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/admin/appearance");
  return { ok: true };
}
