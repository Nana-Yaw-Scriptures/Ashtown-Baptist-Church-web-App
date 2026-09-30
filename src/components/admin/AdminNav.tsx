"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/admin/icons";

type Item = { href: string; label: string; icon: string; adminOnly?: boolean };
type Group = { heading: string; items: Item[] };

const GROUPS: Group[] = [
  {
    heading: "Content",
    items: [
      { href: "/admin", label: "Overview", icon: "overview" },
      { href: "/admin/sermons", label: "Sermons", icon: "sermons" },
      { href: "/admin/events", label: "Events", icon: "events" },
      { href: "/admin/gallery", label: "Gallery", icon: "gallery" },
      { href: "/admin/appearance", label: "Appearance", icon: "appearance" },
    ],
  },
  {
    heading: "Giving",
    items: [
      { href: "/admin/donations", label: "Giving", icon: "giving", adminOnly: true },
      { href: "/admin/funds", label: "Funds", icon: "funds", adminOnly: true },
    ],
  },
  {
    heading: "Community",
    items: [
      { href: "/admin/announcements", label: "Announcements", icon: "announcements", adminOnly: true },
      { href: "/admin/messages", label: "Messages", icon: "messages", adminOnly: true },
      { href: "/admin/prayer", label: "Prayer", icon: "prayer", adminOnly: true },
    ],
  },
  {
    heading: "People",
    items: [
      { href: "/admin/directory", label: "Members", icon: "directory", adminOnly: true },
      { href: "/admin/members", label: "Roles", icon: "members", adminOnly: true },
    ],
  },
];

export function AdminNav({
  role,
  onNavigate,
}: {
  role: "admin" | "media";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className="space-y-6">
      {GROUPS.map((g) => {
        const items = g.items.filter((i) => role === "admin" || !i.adminOnly);
        if (items.length === 0) return null;
        return (
          <div key={g.heading}>
            <p className="px-3 mb-2 text-xs text-white/40">{g.heading}</p>
            <div className="space-y-1">
              {items.map((i) => {
                const active = isActive(i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-white text-dusk-700 font-medium shadow-sm"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon name={i.icon} className="h-[18px] w-[18px] shrink-0" />
                    {i.label}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
