import { ShieldCheck } from "lucide-react";

export default function SafetyReminder() {
  return (
    <div className="mt-6 rounded-xl border border-accent/40 bg-accent/15 p-5 flex gap-4">
      <div className="shrink-0 mt-0.5">
        <div className="h-9 w-9 rounded-full bg-accent/40 flex items-center justify-center">
          <ShieldCheck size={18} className="text-accent-foreground" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="font-serif text-base text-accent-foreground">
          A small kindness — stay safe
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Meet in public, bring a friend if you can, and trust your instincts.
        </p>
      </div>
    </div>
  );
}
