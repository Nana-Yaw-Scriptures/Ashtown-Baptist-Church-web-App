import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui";

export async function AnnouncementBar() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("message")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.message) return null;

  return (
    <div className="bg-dusk-700 text-white text-sm">
      <Container className="py-2 text-center">{data.message}</Container>
    </div>
  );
}
