import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui";
import { GivingForm } from "@/components/GivingForm";
import type { Fund } from "@/lib/types";

export const metadata = { title: "Donate · Ashtown Baptist Church" };

export default async function DonatePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("funds")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const funds = (data as Fund[] | null) ?? [];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Container className="py-16">
      <div className="grid gap-12 lg:grid-cols-2 items-start">
        <div>
          <p className="text-sage mb-3">Generosity</p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight">
            Donate toward the work of the church.
          </h1>
          <div className="prose-body mt-6 text-ink/80">
            <p>
              Everything we do — worship, care for our neighbors, and mission
              near and far — is carried by the generosity of God's people.
              Thank you for being part of it.
            </p>
            <p>
              You can donate a one-time gift below. If you would like to set up
              regular giving, reach out and we will help you arrange it.
            </p>
          </div>
        </div>

        {funds.length === 0 ? (
          <p className="text-ink/60">
            Giving is not set up yet. Once funds are added, the giving form will
            appear here.
          </p>
        ) : (
          <GivingForm funds={funds} defaultEmail={user?.email ?? ""} />
        )}
      </div>
    </Container>
  );
}
