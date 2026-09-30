"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signIn, signUp } from "@/actions/auth";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-dusk-600 text-paper py-3 text-sm font-medium hover:bg-dusk-700 disabled:opacity-50"
    >
      {pending ? "Please wait..." : label}
    </button>
  );
}

export function AuthForm({
  mode,
  next,
}: {
  mode: "login" | "signup";
  next?: string;
}) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {mode === "signup" && (
        <div>
          <label className="block text-sm text-sage mb-1">Full name</label>
          <input
            name="full_name"
            required
            className="w-full rounded-lg border border-mist px-3 py-2.5 text-sm focus:border-dusk-500 outline-none"
          />
        </div>
      )}
      <div>
        <label className="block text-sm text-sage mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-mist px-3 py-2.5 text-sm focus:border-dusk-500 outline-none"
        />
      </div>
      <div>
        <label className="block text-sm text-sage mb-1">Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-lg border border-mist px-3 py-2.5 text-sm focus:border-dusk-500 outline-none"
        />
      </div>

      {next && <input type="hidden" name="next" value={next} />}

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton label={mode === "login" ? "Sign in" : "Create account"} />

      <p className="text-sm text-ink/70 text-center">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" className="text-dusk-600 hover:underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-dusk-600 hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
