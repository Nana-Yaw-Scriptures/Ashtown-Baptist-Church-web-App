import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { AppearanceForm } from "@/components/admin/AppearanceForm";

export default async function AppearancePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("hero_image_url, feature_image_url, feature_caption")
    .eq("id", "main")
    .maybeSingle();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appearance"
        description="Change the photos shown on the public pages."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <AppearanceForm
          target="hero"
          currentUrl={data?.hero_image_url ?? null}
          title="Home & About background"
          help="A wide, landscape photo behind the hero text. Darker images read best."
        />
        <AppearanceForm
          target="feature"
          currentUrl={data?.feature_image_url ?? null}
          title="Featured flyer (About page)"
          help="Upload the day's flyer. It shows on the About page. Change it any time."
          contain
          caption={data?.feature_caption ?? null}
        />
      </div>
    </div>
  );
}
