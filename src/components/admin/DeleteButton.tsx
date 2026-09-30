"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/types";

// Icon delete control (red) with a styled confirmation dialog.
export function DeleteButton({
  action,
  label = "Delete",
  confirmText = "Delete this item?",
  redirectTo,
}: {
  action: () => Promise<ActionResult>;
  label?: string;
  confirmText?: string;
  redirectTo?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function confirm() {
    startTransition(async () => {
      const res = await action();
      if ("error" in res && res.error) {
        window.alert(res.error);
        setOpen(false);
        return;
      }
      setOpen(false);
      if (redirectTo) router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={label}
        title={label}
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-amber-500 hover:bg-amber-400/10 transition-colors disabled:opacity-50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl2 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                  <path d="M12 9v4M12 17h.01" />
                </svg>
              </span>
              <div>
                <h3 className="font-display text-lg leading-tight">Please confirm</h3>
                <p className="mt-1 text-sm text-ink/70">{confirmText}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={pending}
                className="rounded-full border border-mist bg-white px-4 py-2 text-sm hover:border-dusk-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirm}
                disabled={pending}
                className="rounded-full bg-amber-400 text-white px-4 py-2 text-sm font-medium hover:bg-amber-500 disabled:opacity-50"
              >
                {pending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
