"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/sermons", label: "Sermons" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/donate", label: "Donate" },
];

export function NavClient({
  signedIn,
  isStaff,
}: {
  signedIn: boolean;
  isStaff: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className={cn(
        "relative text-sm transition-colors hover:text-white",
        "after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-colors",
        isActive(href)
          ? "text-white font-medium after:bg-amber-400"
          : "text-white/75 after:bg-transparent"
      )}
    >
      {label}
    </Link>
  );

  return (
    <>
      <nav className="hidden md:flex items-center gap-7">
        {links.map((l) => (
          <NavLink key={l.href} {...l} />
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-4">
        {signedIn ? (
          <>
            <Link href="/dashboard" className="text-sm text-white/75 hover:text-white">
              My space
            </Link>
            {isStaff && (
              <Link href="/admin" className="text-sm text-white/75 hover:text-white">
                Admin
              </Link>
            )}
            <button
              onClick={signOut}
              className="text-sm text-white/75 hover:text-white"
            >
              Sign out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-amber-400 text-white px-4 py-2 text-sm hover:bg-amber-500 transition-colors"
          >
            Sign in
          </Link>
        )}
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-white"
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {/* Mobile panel */}
      {open && (
        <div className="absolute top-full left-0 right-0 md:hidden bg-dusk-700 border-t border-amber-400 shadow-sm">
          <div className="flex flex-col gap-4 px-5 py-5">
            {links.map((l) => (
              <NavLink key={l.href} {...l} />
            ))}
            <div className="h-px bg-white/20" />
            {signedIn ? (
              <>
                <NavLink href="/dashboard" label="My space" />
                {isStaff && <NavLink href="/admin" label="Admin" />}
                <button onClick={signOut} className="text-left text-sm text-white/75">
                  Sign out
                </button>
              </>
            ) : (
              <NavLink href="/login" label="Sign in" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
