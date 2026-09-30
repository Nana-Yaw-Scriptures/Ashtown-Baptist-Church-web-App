import { Container } from "@/components/ui";
import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Create account · Ashtown Baptist Church" };

export default function SignupPage() {
  return (
    <Container className="py-20 max-w-md">
      <h1 className="font-display text-3xl text-center">Join the community</h1>
      <p className="mt-2 text-center text-ink/70">
        Create an account to connect with the church through the week.
      </p>
      <div className="mt-8 rounded-xl2 border border-mist bg-white p-6 sm:p-8">
        <AuthForm mode="signup" />
      </div>
    </Container>
  );
}
