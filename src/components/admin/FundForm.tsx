"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFund, updateFund } from "@/actions/funds";
import { Button } from "@/components/ui";
import type { Fund } from "@/lib/types";

const input =
  "w-full rounded-lg border border-mist px-3 py-2 text-sm focus:border-dusk-500 outline-none";

export function FundForm({ fund }: { fund?: Fund }) {
  const editing = !!fund;
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = editing ? await updateFund(fund!.id, formData) : await createFund(formData);
      if (res.error) return setError(res.error);
      if (editing) router.push("/admin/funds");
      else formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <form ref={formRef} action={onSubmit} className="rounded-xl2 border border-mist bg-white p-6 space-y-3">
      <h2 className="font-display text-lg">{editing ? "Edit fund" : "Add a fund"}</h2>
      <input name="name" required placeholder="Fund name (e.g. Missions)" defaultValue={fund?.name} className={input} />
      <input name="description" placeholder="Short description (optional)" defaultValue={fund?.description ?? ""} className={input} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_active" defaultChecked={fund ? fund.is_active : true} className="accent-dusk-600" />
        Active (shown on the giving page)
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Saving..." : editing ? "Save changes" : "Add fund"}
        </Button>
        {editing && (
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/funds")}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
