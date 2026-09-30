import { Container } from "@/components/ui";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Sign in · Ashtown Baptist Church" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <Container className="py-20 max-w-md">
      <h1 className="font-display text-3xl text-center">Welcome back</h1>
      <p className="mt-2 text-center text-ink/70">
        Sign in to see your space, register for events, and post to the prayer wall.
      </p>
      <div className="mt-8 rounded-xl2 border border-mist bg-white p-6 sm:p-8">
        <AuthForm mode="login" next={next} />
      </div>
    </Container>
  );
}
