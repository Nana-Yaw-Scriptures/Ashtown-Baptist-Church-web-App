// Paystack API helpers (server-side). Uses the secret key.
const BASE = "https://api.paystack.co";

export async function paystackInitialize(p: {
  email: string;
  amountPesewas: number;
  reference: string;
  callbackUrl: string;
  currency?: string;
  metadata?: Record<string, unknown>;
}) {
  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: p.email,
      amount: p.amountPesewas, // in pesewas
      currency: p.currency ?? "GHS",
      reference: p.reference,
      callback_url: p.callbackUrl,
      metadata: p.metadata ?? {},
    }),
    cache: "no-store",
  });
  return res.json();
}

export async function paystackVerify(reference: string) {
  const res = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY!}` },
    cache: "no-store",
  });
  return res.json();
}
