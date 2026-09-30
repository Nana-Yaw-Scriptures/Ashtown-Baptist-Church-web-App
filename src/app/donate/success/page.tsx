import Link from "next/link";
import { Container, ButtonLink } from "@/components/ui";

export const metadata = { title: "Thank you · Ashtown Baptist Church" };

export default function DonateSuccessPage() {
  return (
    <Container className="py-24 text-center max-w-xl">
      <div className="mx-auto h-14 w-14 rounded-full bg-amber-400 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1C2434" strokeWidth="2">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-4xl leading-tight">Thank you.</h1>
      <p className="mt-4 text-ink/75 leading-relaxed">
        Your gift has been received. A receipt is on its way to your email. We
        are grateful for your generosity.
      </p>
      <div className="mt-8">
        <ButtonLink href="/" variant="primary">Back home</ButtonLink>
      </div>
    </Container>
  );
}
