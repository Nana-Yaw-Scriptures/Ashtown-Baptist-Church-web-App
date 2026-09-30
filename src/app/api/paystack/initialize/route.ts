import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { paystackInitialize } from "@/lib/paystack";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// Starts a Paystack transaction and records a pending donation.
// The /donate/success page verifies it on return.
export async function POST(req: Request) {
  try {
    const { amount_cents, fund_id, email } = await req.json();

    if (!amount_cents || amount_cents < 100) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const donorEmail = String(email || user?.email || "").trim();
    if (!donorEmail) {
      return NextResponse.json({ error: "An email is required to donate." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    let fundName = "General Fund";
    if (fund_id) {
      const { data: fund } = await supabase.from("funds").select("name").eq("id", fund_id).single();
      if (fund?.name) fundName = fund.name;
    }

    const reference = randomUUID();

    const service = createServiceClient();
    await service.from("donations").insert({
      user_id: user?.id || null,
      fund_id: fund_id || null,
      amount_cents,
      currency: "ghs",
      status: "pending",
      provider_reference: reference,
      donor_email: donorEmail,
    });

    const init = await paystackInitialize({
      email: donorEmail,
      amountPesewas: amount_cents,
      reference,
      callbackUrl: `${siteUrl}/donate/success`,
      currency: "GHS",
      metadata: { fund_id: fund_id || "", fund_name: fundName, user_id: user?.id || "" },
    });

    if (!init.status || !init.data?.authorization_url) {
      return NextResponse.json(
        { error: init.message || "Could not start the payment." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: init.data.authorization_url });
  } catch (e) {
    console.error("paystack initialize error", e);
    return NextResponse.json({ error: "Could not start the payment." }, { status: 500 });
  }
}
