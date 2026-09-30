import { Container, ButtonLink } from "@/components/ui";
import { paystackVerify } from "@/lib/paystack";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata = { title: "Thank you · Ashtown Baptist Church" };
export const dynamic = "force-dynamic";

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const { reference, trxref } = await searchParams;
  const ref = reference || trxref;

  let state: "success" | "failed" | "missing" = "missing";

  if (ref) {
    const result = await paystackVerify(ref);
    const ok = result?.status && result?.data?.status === "success";
    const service = createServiceClient();
    if (ok) {
      state = "success";
      await service
        .from("donations")
        .update({ status: "succeeded", provider_transaction: String(result.data.id ?? "") })
        .eq("provider_reference", ref);
    } else {
      state = "failed";
      await service.from("donations").update({ status: "failed" }).eq("provider_reference", ref);
    }
  }

  if (state === "failed") {
    return (
      <Container className="py-24 text-center max-w-xl">
        <h1 className="font-display text-4xl leading-tight">We couldn&apos;t confirm your gift</h1>
        <p className="mt-4 text-ink/75 leading-relaxed">
          The payment didn&apos;t complete, or we couldn&apos;t verify it. No need to worry —
          you can try again, and nothing was recorded.
        </p>
        <div className="mt-8">
          <ButtonLink href="/donate" variant="primary">Try again</ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-24 text-center max-w-xl">
      <div className="mx-auto h-14 w-14 rounded-full bg-amber-400 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-4xl leading-tight">Thank you.</h1>
      <p className="mt-4 text-ink/75 leading-relaxed">
        {state === "success"
          ? "Your gift has been received, and a receipt is on its way to your email. We are grateful for your generosity."
          : "Thank you for your generosity."}
      </p>
      <div className="mt-8">
        <ButtonLink href="/" variant="primary">Back home</ButtonLink>
      </div>
    </Container>
  );
}
