"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { importMembers } from "@/actions/members";
import { Button } from "@/components/ui";

export function MemberImport() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function onSubmit(formData: FormData) {
    setError(null);
    setResult(null);
    startTransition(async () => {
      const res = await importMembers(formData);
      if (res.error) return setError(res.error);
      formRef.current?.reset();
      setResult(`Imported ${res.count} member${res.count === 1 ? "" : "s"}.`);
      router.refresh();
    });
  }

  if (!open) {
    return (
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Import from spreadsheet
      </Button>
    );
  }

  return (
    <form ref={formRef} action={onSubmit} className="rounded-xl2 border border-mist bg-white p-6 space-y-3">
      <h2 className="font-display text-lg">Import members from a CSV file</h2>
      <p className="text-sm text-ink/70">
        Upload a CSV with a <strong>Name</strong> column. Other columns are matched by
        heading (Date of Birth, Contact 1, Region, House Fellowship, Committee, and so on).
        For "Areas of Ministry", separate several with a comma or semicolon in one cell.
        Photos are not imported — add them to each member afterward.{" "}
        <a href="/members-template.csv" className="text-dusk-600 hover:underline">Download a template</a>.
      </p>
      <input
        name="file"
        type="file"
        accept=".csv,text/csv"
        required
        className="block w-full text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-dusk-600 file:text-white file:px-4 file:py-2 file:text-sm hover:file:bg-dusk-700"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && <p className="text-sm text-sage">{result}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Importing..." : "Import"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Close</Button>
      </div>
    </form>
  );
}
