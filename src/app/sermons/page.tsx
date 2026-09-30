import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui";
import { SermonBrowser } from "@/components/SermonBrowser";
import type { Sermon } from "@/lib/types";

export const metadata = { title: "Sermons · Ashtown Baptist Church" };
export const revalidate = 60;

export default async function SermonsPage() {
  const supabase = await createClient();
  const { data: sermons } = await supabase
    .from("sermons")
    .select("*")
    .eq("published", true)
    .order("preached_on", { ascending: false });

  const list = (sermons as Sermon[] | null) ?? [];

  return (
    <Container className="py-16">
      <div className="max-w-2xl">
        <p className="text-sage mb-3">Teaching</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight">
          Sermons
        </h1>
        <p className="mt-4 text-ink/75 leading-relaxed">
          Catch up on recent teaching, or work back through a series. New
          sermons are posted after each Sunday.
        </p>
      </div>

      {list.length === 0 ? (
        <p className="mt-12 text-ink/60">
          No sermons have been posted yet. They will show up here soon.
        </p>
      ) : (
        <div className="mt-10">
          <SermonBrowser sermons={list} />
        </div>
      )}
    </Container>
  );
}
