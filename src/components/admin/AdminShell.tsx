"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminNav } from "@/components/admin/AdminNav";
import { Icon } from "@/components/admin/icons";

export function AdminShell({
  role,
  name,
  children,
}: {
  role: "admin" | "media";
  name: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const Brand = (
    <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/atbc-logo.png" alt="" className="h-9 w-9 rounded-full bg-white" />
      <span className="leading-tight">
        <span className="block font-display text-white text-base">Church admin</span>
        <span className="block text-xs text-white/50 capitalize">{name || role}</span>
      </span>
    </Link>
  );

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">{Brand}</div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <AdminNav role={role} onNavigate={() => setOpen(false)} />
      </div>
      <div className="border-t border-white/10 p-3">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Icon name="logout" className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F5FA] lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-dusk-700">
        {SidebarInner}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-dusk-700 px-4 h-14">
        {Brand}
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-white">
          <Icon name="menu" className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <aside className="relative w-72 max-w-[80%] bg-dusk-700">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-4 right-4 text-white/70 hover:text-white">
              <Icon name="close" className="h-6 w-6" />
            </button>
            {SidebarInner}
          </aside>
        </div>
      )}

      {/* Content */}
      <main className="lg:pl-64 flex-1">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
