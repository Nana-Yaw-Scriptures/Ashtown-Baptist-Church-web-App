import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// Creates a Stripe Checkout session for a one-time gift and records a
// pending donation. The webhook marks it succeeded once payment clears.
export async function POST(req: Request) {
  try {
    const { amount_cents, fund_id } = await req.json();

    if (!amount_cents || amount_cents < 100) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Look up the fund name for a nice line item.
    let fundName = "General Fund";
    if (fund_id) {
      const { data: fund } = await supabase
        .from("funds")
        .select("name")
        .eq("id", fund_id)
        .single();
      if (fund?.name) fundName = fund.name;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "ghs",
            unit_amount: amount_cents,
            product_data: { name: `Gift — ${fundName}` },
          },
        },
      ],
      customer_email: user?.email,
      success_url: `${siteUrl}/donate/success`,
      cancel_url: `${siteUrl}/donate`,
      metadata: {
        fund_id: fund_id || "",
        user_id: user?.id || "",
      },
    });

    // Record a pending donation using the service client (bypasses RLS).
    const service = createServiceClient();
    await service.from("donations").insert({
      user_id: user?.id || null,
      fund_id: fund_id || null,
      amount_cents,
      currency: "ghs",
      status: "pending",
      stripe_session_id: session.id,
      donor_email: user?.email || null,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("checkout error", e);
    return NextResponse.json(
      { error: "Could not start checkout." },
      { status: 500 }
    );
  }
}
