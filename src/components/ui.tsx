import Link from "next/link";
import { cn } from "@/lib/utils";

// A consistent content width used across pages.
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-content px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "amber";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dusk-500 disabled:opacity-50 disabled:cursor-not-allowed";

// "amber" is the church red accent — kept as the variant name so existing
// call sites (the Donate buttons) don't need to change.
const buttonVariants = {
  primary: "bg-dusk-600 text-white hover:bg-dusk-700",
  amber: "bg-amber-400 text-white hover:bg-amber-500",
  ghost: "border border-mist bg-white text-ink hover:border-dusk-500 hover:text-dusk-600",
};

export function Button({
  children,
  variant = "primary",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonBase, buttonVariants[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "amber";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(buttonBase, buttonVariants[variant], className)}
    >
      {children}
    </Link>
  );
}

// Section heading with an optional lead-in line above.
export function SectionHeading({
  title,
  lead,
  align = "left",
}: {
  title: string;
  lead?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {lead && <p className="text-amber-500 text-sm font-medium mb-2">{lead}</p>}
      <h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
        {title}
      </h2>
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-dusk-50 text-dusk-700 px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}
