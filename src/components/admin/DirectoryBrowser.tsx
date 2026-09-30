"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Member } from "@/lib/types";

const inp = "rounded-lg border border-mist px-3 py-2 text-sm focus:border-dusk-500 outline-none bg-white";

export function DirectoryBrowser({ members }: { members: Member[] }) {
  const [q, setQ] = useState("");
  const [ministry, setMinistry] = useState("");
  const [fellowship, setFellowship] = useState("");
  const [committee, setCommittee] = useState("");

  // Dropdown options come from the values actually present in the data,
  // so they always match regardless of how members typed them.
  const ministryOptions = useMemo(() => {
    const s = new Set<string>();
    members.forEach((m) => (m.areas_of_ministry ?? []).forEach((a) => {
      const t = (a || "").trim();
      if (t) s.add(t);
    }));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [members]);

  const fellowshipOptions = useMemo(() => {
    const s = new Set<string>();
    members.forEach((m) => { const t = (m.house_fellowship || "").trim(); if (t) s.add(t); });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [members]);

  const committeeOptions = useMemo(() => {
    const s = new Set<string>();
    members.forEach((m) => { const t = (m.committee || "").trim(); if (t) s.add(t); });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [members]);

  const filtered = useMemo(() => members.filter((m) => {
    if (q) {
      const text = `${m.name} ${m.contact1 ?? ""} ${m.contact2 ?? ""} ${m.location_city ?? ""} ${m.home_town ?? ""} ${m.place_of_birth ?? ""} ${m.region ?? ""} ${m.email ?? ""}`.toLowerCase();
      if (!text.includes(q.trim().toLowerCase())) return false;
    }
    if (ministry && !(m.areas_of_ministry ?? []).map((a) => (a || "").trim()).includes(ministry)) return false;
    if (fellowship && (m.house_fellowship || "").trim() !== fellowship) return false;
    if (committee && (m.committee || "").trim() !== committee) return false;
    return true;
  }), [members, q, ministry, fellowship, committee]);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, contact, town..." className={`${inp} flex-1 min-w-[12rem]`} />
        {ministryOptions.length > 0 && (
          <select value={ministry} onChange={(e) => setMinistry(e.target.value)} className={inp}>
            <option value="">All ministries</option>
            {ministryOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        )}
        {fellowshipOptions.length > 0 && (
          <select value={fellowship} onChange={(e) => setFellowship(e.target.value)} className={inp}>
            <option value="">All fellowships</option>
            {fellowshipOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        )}
        {committeeOptions.length > 0 && (
          <select value={committee} onChange={(e) => setCommittee(e.target.value)} className={inp}>
            <option value="">All committees</option>
            {committeeOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        )}
      </div>

      <p className="mt-4 text-sm text-sage">{filtered.length} of {members.length} members</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <Link key={m.id} href={`/admin/directory/${m.id}`} className="flex items-center gap-3 rounded-xl2 border border-mist bg-white p-3 hover:border-dusk-500 transition-colors">
            {m.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.photo_url} alt={m.name} className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-dusk-50 flex items-center justify-center text-dusk-600 font-medium">
                {m.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-medium truncate">{m.name}</p>
              <p className="text-xs text-sage truncate">
                {[m.house_fellowship, m.contact1].filter(Boolean).join(" · ") || "—"}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && <p className="mt-6 text-ink/60">No members match.</p>}
    </div>
  );
}
