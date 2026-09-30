import { Icon } from "@/components/admin/icons";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-ink leading-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-sage">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-mist bg-white shadow-[0_1px_2px_rgba(16,33,61,0.04)] ${className}`}>
      {children}
    </div>
  );
}

export type Tone = "navy" | "red" | "teal" | "amber" | "violet" | "rose";

const TONES: Record<Tone, { card: string; chip: string }> = {
  navy: { card: "bg-[#EEF2FB] border-[#DBE4F4]", chip: "bg-[#DBE4F4] text-dusk-600" },
  violet: { card: "bg-[#F3EFFA] border-[#E5DBF4]", chip: "bg-[#E5DBF4] text-[#5B3FA0]" },
  teal: { card: "bg-[#E9F5F1] border-[#D2E8E2]", chip: "bg-[#D2E8E2] text-[#0F766E]" },
  amber: { card: "bg-[#FBF3E2] border-[#F1E2C2]", chip: "bg-[#F1E2C2] text-[#B45309]" },
  rose: { card: "bg-[#FBEDF2] border-[#F4D8E4]", chip: "bg-[#F4D8E4] text-[#BE185D]" },
  red: { card: "bg-[#FCECEC] border-[#F5D6D6]", chip: "bg-[#F5D6D6] text-[#C81E1E]" },
};

export function StatCard({
  icon,
  label,
  value,
  tone = "navy",
}: {
  icon: string;
  label: string;
  value: string | number;
  tone?: Tone;
}) {
  const t = TONES[tone];
  return (
    <div className={`rounded-2xl border p-5 ${t.card}`}>
      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${t.chip}`}>
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="mt-4 font-display text-3xl text-ink leading-none">{value}</p>
      <p className="mt-1 text-sm text-sage">{label}</p>
    </div>
  );
}
