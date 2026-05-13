import Wrapper from "../layout/Wrapper";
import SafetyReminder from "../ui/safety-reminder";

const project = [
  {
    step: "01",
    label: "Post",
    title: "List what you'd like to share",
    description:
      "Snap a few photos, write a couple lines, and let your neighbors discover what you have on offer.",
  },
  {
    step: "02",
    label: "Match",
    title: "Pick who it goes to",
    description:
      "Requests arrive in your inbox. Approve the one that feels right — the others are politely declined.",
  },
  {
    step: "03",
    label: "Pass it on",
    title: "Hand it over in person",
    description:
      "Meet somewhere public, exchange a smile, and let the item begin its next chapter.",
  },
];

export default function Sharing() {
  return (
    <section className="border-t border-border/60 bg-secondary/30">
      <Wrapper className="py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                The process
              </p>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              How it works
            </h2>
          </div>
          <p className="md:col-span-6 md:col-start-7 text-muted-foreground text-base md:text-lg leading-relaxed self-end">
            Sharing with your community is simple. No money changes hands — just
            a small act of kindness that keeps things in use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/60 rounded-lg overflow-hidden">
          {project.map((item, i) => (
            <article
              key={item.step}
              className="group relative bg-background p-8 md:p-10 flex flex-col gap-4 min-h-72 transition-colors hover:bg-card"
            >
              <span className="absolute top-6 right-6 font-serif text-6xl md:text-7xl text-primary/10 leading-none select-none">
                {item.step}
              </span>
              <div className="space-y-1">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  Step {i + 1} — {item.label}
                </p>
              </div>
              <h3 className="font-serif text-2xl leading-snug mt-auto">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <SafetyReminder />
      </Wrapper>
    </section>
  );
}
