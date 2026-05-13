import { cn } from "@/lib/utils";

type ItemStatus =
  | "available"
  | "reserved"
  | "claimed"
  | "pending"
  | "approved"
  | "rejected";
type StatusType = { status: ItemStatus; className?: string };

const statusStyles: Record<ItemStatus, string> = {
  available:
    "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400",
  reserved:
    "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400",
  claimed:
    "border-stone-500/30 bg-stone-500/10 text-stone-600 dark:border-stone-400/30 dark:bg-stone-400/10 dark:text-stone-400",
  approved:
    "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400",
  pending:
    "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400",
  rejected:
    "border-rose-600/30 bg-rose-600/10 text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-400",
};

export default function StatusBadge({ status, className }: StatusType) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium tracking-wider uppercase backdrop-blur-md border capitalize",
        statusStyles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
