"use client";

import { usePathname } from "next/navigation";

// Public site chrome (nav, footer) should not appear inside the admin shell.
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
