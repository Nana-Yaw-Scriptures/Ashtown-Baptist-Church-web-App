import { format } from "date-fns";

// Combine class names, skipping falsy values.
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Money in pesewas -> "GH₵12.00"
export function formatMoney(cents: number, currency = "GHS") {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

// Seconds -> "39 min"
export function formatDuration(seconds: number | null) {
  if (!seconds) return "";
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

export function formatDate(iso: string) {
  return format(new Date(iso), "MMM d, yyyy");
}

export function formatDateTime(iso: string) {
  return format(new Date(iso), "EEE, MMM d · h:mm a");
}

export function formatTime(iso: string) {
  return format(new Date(iso), "h:mm a");
}

// Turn a YouTube watch or short URL into an embeddable URL.
export function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    return null;
  } catch {
    return null;
  }
}

// Turn a video URL into an embeddable URL. Handles YouTube and Facebook.
// Note: a Facebook video must be Public for it to embed.
export function toVideoEmbed(url: string): string | null {
  const yt = toYouTubeEmbed(url);
  if (yt) return yt;
  try {
    const u = new URL(url);
    if (u.hostname.includes("facebook.com") || u.hostname.includes("fb.watch")) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        url
      )}&show_text=false&width=560`;
    }
  } catch {
    return null;
  }
  return null;
}
