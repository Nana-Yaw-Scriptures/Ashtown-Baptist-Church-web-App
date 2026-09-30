"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setMemberRole } from "@/actions/admin";

export function RoleToggle({
  userId,
  role,
}: {
  userId: string;
  role: "member" | "admin" | "media";
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function change(next: "member" | "admin" | "media") {
    if (next === role) return;
    startTransition(async () => {
      await setMemberRole(userId, next);
      router.refresh();
    });
  }

  return (
    <select
      value={role}
      disabled={pending}
      onChange={(e) => change(e.target.value as "member" | "admin" | "media")}
      className="rounded-lg border border-mist px-2 py-1 text-sm focus:border-dusk-500 outline-none disabled:opacity-50"
    >
      <option value="member">Member</option>
      <option value="media">Media</option>
      <option value="admin">Admin</option>
    </select>
  );
}
