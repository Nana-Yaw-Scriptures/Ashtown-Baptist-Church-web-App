"use client";

import { useState } from "react";
import type { Fund } from "@/lib/types";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const PRESETS = [2000, 5000, 10000, 25000]; // in pesewas (₵20, ₵50, ₵100, ₵250)

export function GivingForm({
  funds,
  defaultEmail = "",
}: {
  funds: Fund[];
  defaultEmail?: string;
}) {
  const [amount, setAmount] = useState<number>(5000);
  const [custom, setCustom] = useState("");
  const [fundId, setFundId] = useState(funds[0]?.id ?? "");
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveAmount = custom ? Math.round(parseFloat(custom) * 100) : amount;

  async function handleDonate() {
    setError(null);
    if (!effectiveAmount || effectiveAmount < 100) {
      setError("Please enter an amount of at least ₵1.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email so we can send a receipt.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount_cents: effectiveAmount, fund_id: fundId, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl2 border border-mist bg-white p-6 sm:p-8">
      <label className="block text-sm text-sage mb-2">Choose an amount</label>
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => {
              setAmount(p);
              setCustom("");
            }}
            className={cn(
              "rounded-lg border py-3 text-sm font-medium transition-colors",
              !custom && amount === p
                ? "border-dusk-600 bg-dusk-50 text-dusk-700"
                : "border-mist hover:border-dusk-500"
            )}
          >
            ₵{p / 100}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/50">₵</span>
          <input
            inputMode="decimal"
            placeholder="Other amount"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^0-9.]/g, ""))}
            className="w-full rounded-lg border border-mist pl-7 pr-3 py-3 text-sm focus:border-dusk-500 outline-none"
          />
        </div>
      </div>

      <label className="block text-sm text-sage mt-5 mb-2">Your email (for a receipt)</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-lg border border-mist px-3 py-3 text-sm focus:border-dusk-500 outline-none"
      />

      <label className="block text-sm text-sage mt-5 mb-2">Donate toward</label>
      <select
        value={fundId}
        onChange={(e) => setFundId(e.target.value)}
        className="w-full rounded-lg border border-mist px-3 py-3 text-sm focus:border-dusk-500 outline-none bg-white"
      >
        {funds.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <Button onClick={handleDonate} disabled={loading} variant="amber" className="mt-6 w-full">
        {loading ? "Redirecting to Paystack..." : `Donate ₵${(effectiveAmount / 100).toFixed(2)}`}
      </Button>
      <p className="mt-3 text-xs text-ink/50 text-center">
        Payments are processed securely by Paystack — card or mobile money. You do not need an account to donate.
      </p>
    </div>
  );
}
