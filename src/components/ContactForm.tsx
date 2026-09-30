"use client";

import { useRef, useState, useTransition } from "react";
import { sendMessage } from "@/actions/contact";
import { Button } from "@/components/ui";

const input =
  "w-full rounded-lg border border-mist px-3 py-2.5 text-sm focus:border-dusk-500 outline-none";

export function ContactForm() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await sendMessage(formData);
      if (res.error) return setError(res.error);
      formRef.current?.reset();
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="rounded-xl2 border border-mist bg-white p-6">
        <p className="font-display text-lg">Thank you.</p>
        <p className="mt-1 text-ink/70 text-sm">
          Your message has been sent. We will get back to you soon.
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-4 text-sm text-dusk-600 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={onSubmit} className="rounded-xl2 border border-mist bg-white p-6 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Your name" className={input} />
        <input name="email" type="email" required placeholder="Your email" className={input} />
      </div>
      <input name="subject" placeholder="Subject (optional)" className={input} />
      <textarea name="body" required rows={5} placeholder="Your message" className={input} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={pending} variant="primary">
        {pending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
