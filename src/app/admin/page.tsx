import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getRole } from "@/lib/authz";
import { formatMoney } from "@/lib/utils";
import { PageHeader, StatCard, type Tone } from "@/components/admin/ui";
import { Icon } from "@/components/admin/icons";

async function count(table: string, filter?: (q: any) => any) {
  const supabase = await createClient();
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count } = await q;
  return count ?? 0;
}

export default async function AdminOverview() {
  const supabase = await createClient();
  const role = await getRole();
  const isAdmin = role === "admin";

  const [sermons, events, gallery] = await Promise.all([
    count("sermons"),
    count("events"),
    count("gallery"),
  ]);

  const stats: { icon: string; label: string; value: number; tone: Tone }[] = [
    { icon: "sermons", label: "Sermons", value: sermons, tone: "violet" },
    { icon: "events", label: "Events", value: events, tone: "teal" },
    { icon: "gallery", label: "Gallery items", value: gallery, tone: "amber" },
  ];

  let totalGiving = 0;
  let openPrayers = 0;
  let newMessages = 0;

  if (isAdmin) {
    const members = await count("members");
    openPrayers = await count("prayer_requests", (q) => q.eq("status", "open"));
    newMessages = await count("contact_messages", (q) => q.eq("handled", false));
    const { data: gifts } = await supabase.from("donations").select("amount_cents").eq("status", "succeeded");
    totalGiving = (gifts ?? []).reduce((s: number, g: any) => s + g.amount_cents, 0);
    stats.unshift({ icon: "directory", label: "Members", value: members, tone: "navy" });
  }

  const quickLinks = [
    { href: "/admin/sermons", icon: "sermons", label: "Add a sermon" },
    { href: "/admin/events", icon: "events", label: "Add an event" },
    { href: "/admin/gallery", icon: "gallery", label: "Upload to gallery" },
    ...(isAdmin ? [{ href: "/admin/directory/new", icon: "directory", label: "Add a member" }] : []),
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Overview" description="A calm read on the life of the church." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} tone={s.tone} />
        ))}
      </div>

      {isAdmin && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl bg-dusk-600 p-6 text-white shadow-[0_1px_2px_rgba(16,33,61,0.04)]">
            <p className="text-sm text-white/70">Total received (all time)</p>
            <p className="mt-1 font-display text-4xl">{formatMoney(totalGiving)}</p>
            <Link href="/admin/donations" className="mt-4 inline-block text-sm text-white/80 hover:text-white">
              View giving
            </Link>
          </div>
          <div className="grid gap-4">
            <StatCard icon="prayer" label="Open prayer requests" value={openPrayers} tone="rose" />
            <StatCard icon="messages" label="New messages" value={newMessages} tone="red" />
          </div>
        </div>
      )}

      <div>
        <h2 className="font-display text-lg text-ink mb-3">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex items-center gap-3 rounded-2xl border border-mist bg-white p-4 hover:border-dusk-500 transition-colors"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-dusk-50 text-dusk-600">
                <Icon name={q.icon} className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium text-ink">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
