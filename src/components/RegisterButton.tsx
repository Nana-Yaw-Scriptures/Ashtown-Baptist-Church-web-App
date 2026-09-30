"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerForEvent, cancelRegistration } from "@/actions/events";
import { Button, ButtonLink } from "@/components/ui";

export function RegisterButton({
  eventId,
  signedIn,
  initiallyRegistered,
}: {
  eventId: string;
  signedIn: boolean;
  initiallyRegistered: boolean;
}) {
  const [registered, setRegistered] = useState(initiallyRegistered);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  if (!signedIn) {
    return (
      <div>
        <ButtonLink href={`/login?next=/events/${eventId}`} variant="primary">
          Sign in to register
        </ButtonLink>
      </div>
    );
  }

  function toggle() {
    setMessage(null);
    startTransition(async () => {
      const res = registered
        ? await cancelRegistration(eventId)
        : await registerForEvent(eventId);
      if (res.error) {
        setMessage(res.error);
        return;
      }
      setRegistered(!registered);
      router.refresh();
    });
  }

  return (
    <div>
      <Button
        onClick={toggle}
        disabled={pending}
        variant={registered ? "ghost" : "primary"}
      >
        {pending
          ? "Saving..."
          : registered
          ? "You're registered — cancel"
          : "Register to attend"}
      </Button>
      {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
    </div>
  );
}
