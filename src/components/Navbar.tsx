import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui";
import { NavClient } from "@/components/NavClient";

// Server component: reads the session so the nav can reflect sign-in state.
export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isStaff = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isStaff = profile?.role === "admin" || profile?.role === "media";
  }

  return (
    <header className="sticky top-0 z-40 bg-dusk-600 border-t-4 border-amber-400 shadow-sm">
      <Container className="relative flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/atbc-logo.png" alt="Ashtown Baptist Church" className="h-9 w-9 rounded-full bg-white" />
          <span className="font-display text-lg leading-tight text-white hidden sm:block">
            Ashtown Baptist Church
          </span>
          <span className="font-display text-lg text-white sm:hidden">ATBC</span>
        </Link>
        <NavClient signedIn={!!user} isStaff={isStaff} />
      </Container>
    </header>
  );
}
